-- CineTrack: watchlist sharing links
-- Run once in the Supabase SQL Editor (after security.sql).
--
-- Each user can have one shared list. Only the owner can create, update or
-- delete it. Visitors can read a list only through get_shared_list() with the
-- exact link id; the table itself cannot be listed or browsed.

create table if not exists public.shared_lists (
    id          text primary key,
    owner       uuid not null unique default auth.uid() references auth.users(id) on delete cascade,
    content     jsonb not null,
    updated_at  timestamptz not null default now()
);

alter table public.shared_lists enable row level security;

drop policy if exists "own share: read" on public.shared_lists;
drop policy if exists "own share: insert" on public.shared_lists;
drop policy if exists "own share: update" on public.shared_lists;
drop policy if exists "own share: delete" on public.shared_lists;

create policy "own share: read" on public.shared_lists
    for select to authenticated using (owner = auth.uid());
create policy "own share: insert" on public.shared_lists
    for insert to authenticated with check (owner = auth.uid());
create policy "own share: update" on public.shared_lists
    for update to authenticated using (owner = auth.uid()) with check (owner = auth.uid());
create policy "own share: delete" on public.shared_lists
    for delete to authenticated using (owner = auth.uid());

revoke all on public.shared_lists from anon, authenticated;
grant select, insert, update, delete on public.shared_lists to authenticated;

-- Public read of one list by its (unguessable) link id
create or replace function public.get_shared_list(p_id text)
returns jsonb
language sql stable security definer set search_path = public
as $$
    select content from shared_lists where id = p_id;
$$;

revoke all on function public.get_shared_list(text) from public;
grant execute on function public.get_shared_list(text) to anon, authenticated;
