-- CineTrack: güvenlik geçişi
-- Supabase panelinde SQL Editor'a yapıştırıp bir kez çalıştırın.
--
-- Ne yapar:
--  1. movie_tracker tablosuna "owner" (sahip) sütunu ekler.
--  2. Row Level Security açar: her kullanıcı sadece kendi satırını okuyup yazabilir.
--     Anonim anahtarla (script.js içindeki) artık hiçbir satır okunamaz.
--  3. Eski düz metin şifre listesi (system_users) gizlenir; eski kullanıcılar
--     ilk girişlerinde aşağıdaki fonksiyonlarla yeni sisteme taşınır.

-- 0) Yedek: tablonun tam kopyası (sadece ilk çalıştırmada oluşturulur)
create table if not exists public.movie_tracker_backup as
    select * from public.movie_tracker;
alter table public.movie_tracker_backup enable row level security;
revoke all on public.movie_tracker_backup from anon, authenticated;

-- 1) Sahip sütunu
alter table public.movie_tracker
    add column if not exists owner uuid references auth.users(id) on delete cascade;
alter table public.movie_tracker
    alter column owner set default auth.uid();

-- 2) Row Level Security
alter table public.movie_tracker enable row level security;

-- Var olan tüm (muhtemelen herkese açık) kuralları kaldır
do $$
declare p record;
begin
    for p in select policyname from pg_policies
             where schemaname = 'public' and tablename = 'movie_tracker'
    loop
        execute format('drop policy %I on public.movie_tracker', p.policyname);
    end loop;
end $$;

create policy "own row: read" on public.movie_tracker
    for select to authenticated
    using (owner = auth.uid());

create policy "own row: insert" on public.movie_tracker
    for insert to authenticated
    with check (owner = auth.uid() and id = 'user_' || auth.uid()::text);

create policy "own row: update" on public.movie_tracker
    for update to authenticated
    using (owner = auth.uid())
    with check (owner = auth.uid() and id = 'user_' || auth.uid()::text);

revoke all on public.movie_tracker from anon;
revoke all on public.movie_tracker from authenticated;
grant select, insert, update on public.movie_tracker to authenticated;

-- 3) Eski kullanıcıların taşınması
-- Eski şifre listesi artık kimse tarafından doğrudan okunamaz; sadece bu
-- fonksiyonlar (sunucu tarafında) kontrol edebilir.

-- Kullanıcı adı eski listede var mı? (Yeni kayıtta aynı adın alınmasını engeller.)
create or replace function public.legacy_user_exists(p_username text)
returns boolean
language sql stable security definer set search_path = public
as $$
    select exists (
        select 1
        from movie_tracker t, jsonb_array_elements(t.content -> 'users') u
        where t.id = 'system_users'
          and lower(u ->> 'username') = lower(p_username)
    );
$$;

-- Eski kullanıcı adı + şifre doğru mu?
create or replace function public.legacy_check(p_username text, p_password text)
returns boolean
language sql stable security definer set search_path = public
as $$
    select exists (
        select 1
        from movie_tracker t, jsonb_array_elements(t.content -> 'users') u
        where t.id = 'system_users'
          and lower(u ->> 'username') = lower(p_username)
          and u ->> 'password' = p_password
    );
$$;

-- Yeni hesap açıldıktan hemen sonra çağrılır: eski listeleri yeni hesaba
-- bağlar ve kullanıcıyı eski (düz metin) listeden siler.
create or replace function public.legacy_claim(p_username text, p_password text)
returns boolean
language plpgsql security definer set search_path = public
as $$
declare
    v_uid uuid := auth.uid();
    v_row text;
begin
    if v_uid is null then
        raise exception 'not authenticated';
    end if;
    if not public.legacy_check(p_username, p_password) then
        return false;
    end if;

    -- Aynı adın farklı büyük/küçük harfli kopyaları olabilir; en günceli alınır.
    select id into v_row
    from movie_tracker
    where lower(id) = lower('user_' || p_username)
      and owner is null
    order by (content ->> 'lastUpdated')::numeric desc nulls last
    limit 1;

    -- Hiçbir listeyi silmez veya üzerine yazmaz: yeni hesabın zaten bir
    -- satırı varsa eski satır olduğu gibi bırakılır.
    if v_row is not null
       and not exists (select 1 from movie_tracker where id = 'user_' || v_uid::text) then
        update movie_tracker
           set id = 'user_' || v_uid::text, owner = v_uid
         where id = v_row;
    end if;

    update movie_tracker
       set content = jsonb_set(
               content, '{users}',
               coalesce((
                   select jsonb_agg(u)
                   from jsonb_array_elements(content -> 'users') u
                   where lower(u ->> 'username') <> lower(p_username)
               ), '[]'::jsonb))
     where id = 'system_users';

    return true;
end;
$$;

revoke all on function public.legacy_user_exists(text) from public;
revoke all on function public.legacy_check(text, text) from public;
revoke all on function public.legacy_claim(text, text) from public;
grant execute on function public.legacy_user_exists(text) to anon, authenticated;
grant execute on function public.legacy_check(text, text) to anon, authenticated;
grant execute on function public.legacy_claim(text, text) to authenticated;

-- Herkes taşındıktan sonra (system_users listesi boşalınca) temizlik için:
--   drop function public.legacy_claim(text, text);
--   drop function public.legacy_check(text, text);
--   drop function public.legacy_user_exists(text);
--   delete from public.movie_tracker where id = 'system_users';
--   delete from public.movie_tracker where owner is null;
