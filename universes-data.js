/**
 * Curated Cinematic Universes & Director Filmographies
 *
 * Only the presentation metadata lives here. The titles of each collection are fetched
 * from TMDB at runtime using its `sources` (see js/universes.js, fetchUniverseItems):
 *   keywords / companies  TMDB discover (movie + tv), optional `genres`, `media`
 *   collection            a TMDB movie collection
 *   person                a director's feature films
 *   search                TMDB title search (the title must contain the query)
 *   ids                   specific titles: [{ "id": 123, "media": "tv" }]
 * Optional per source: tag / tvTag / dateTags ({tr, en}), minVotes, excludeTitle (regex).
 * Optional per universe: excludeIds (TMDB ids to leave out).
 */
window.CURATED_UNIVERSES = [
  {
    "id": "mcu",
    "category": "universe",
    "name": "Marvel Sinematik Evreni",
    "nameEn": "Marvel Cinematic Universe",
    "creator": "Marvel Studios • Kevin Feige",
    "tagline": "Iron Man’den Avengers Endgame ve Çokluevren Sagasına uzanan efsanevi süper kahraman evreni.",
    "taglineEn": "The legendary superhero saga from Iron Man to Endgame and the Multiverse.",
    "accent": "#e62429",
    "gradient": "linear-gradient(135deg, rgba(230, 36, 41, 0.85) 0%, rgba(139, 0, 0, 0.95) 100%)",
    "icon": "fa-shield-halved",
    "badge": "Marvel Cinematic Universe",
    "backdrop": "/yF1VsEpF7rq8ejipZeuv4XufNkG.jpg",
    "sources": [
      {
        "keywords": "180547",
        "tvTag": {
          "tr": "Dizi",
          "en": "Series"
        },
        "dateTags": [
          {
            "until": "2012-12-31",
            "tag": {
              "tr": "Evre 1",
              "en": "Phase 1"
            }
          },
          {
            "until": "2015-12-31",
            "tag": {
              "tr": "Evre 2",
              "en": "Phase 2"
            }
          },
          {
            "until": "2019-12-31",
            "tag": {
              "tr": "Evre 3",
              "en": "Phase 3"
            }
          },
          {
            "until": "2022-12-31",
            "tag": {
              "tr": "Evre 4",
              "en": "Phase 4"
            }
          },
          {
            "until": "2025-07-22",
            "tag": {
              "tr": "Evre 5",
              "en": "Phase 5"
            }
          },
          {
            "tag": {
              "tr": "Evre 6",
              "en": "Phase 6"
            }
          }
        ]
      }
    ]
  },
  {
    "id": "dcu",
    "category": "universe",
    "name": "DC & Batman Efsaneleri",
    "nameEn": "DC & Batman Legends",
    "creator": "DC Comics • Warner Bros.",
    "tagline": "The Dark Knight üçlemesinden Snyderverse’e ve The Batman’e Gotham ve Adalet Birliği dünyası.",
    "taglineEn": "From The Dark Knight Trilogy to Snyderverse and The Batman.",
    "accent": "#0055ff",
    "gradient": "linear-gradient(135deg, rgba(0, 85, 255, 0.85) 0%, rgba(10, 20, 60, 0.95) 100%)",
    "icon": "fa-mask",
    "badge": "DC Universe",
    "backdrop": "/dqK9Hag1054tghRQSqLSfrkvQnA.jpg",
    "sources": [
      {
        "collection": 263,
        "tag": {
          "tr": "Dark Knight",
          "en": "Dark Knight"
        }
      },
      {
        "keywords": "229266",
        "tag": {
          "tr": "DCEU",
          "en": "DCEU"
        },
        "tvTag": {
          "tr": "Dizi",
          "en": "Series"
        }
      },
      {
        "keywords": "312528",
        "tag": {
          "tr": "DCU",
          "en": "DCU"
        },
        "tvTag": {
          "tr": "Dizi",
          "en": "Series"
        }
      },
      {
        "collection": 948485,
        "tag": {
          "tr": "The Batman",
          "en": "The Batman"
        }
      },
      {
        "ids": [
          {
            "id": 194764,
            "media": "tv"
          }
        ],
        "tag": {
          "tr": "The Batman",
          "en": "The Batman"
        }
      },
      {
        "collection": 987044,
        "tag": {
          "tr": "Elseworlds",
          "en": "Elseworlds"
        }
      }
    ]
  },
  {
    "id": "star-wars",
    "category": "universe",
    "name": "Star Wars Galaktik Evren",
    "nameEn": "Star Wars Galaxy",
    "creator": "George Lucas • Lucasfilm",
    "tagline": "Skywalker efsanesi, Jedi düzeni, Mandalorian ve çok çok uzak bir galaksideki tüm serüvenler.",
    "taglineEn": "The Skywalker saga, the Jedi order, and tales from a galaxy far, far away.",
    "accent": "#00c3ff",
    "gradient": "linear-gradient(135deg, rgba(0, 195, 255, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)",
    "icon": "fa-jedi",
    "badge": "Lucasfilm / Star Wars",
    "backdrop": "/zqkmTXzjkAgPnWGZQeoAcH2ep9n.jpg",
    "sources": [
      {
        "collection": 10,
        "dateTags": [
          {
            "until": "1983-12-31",
            "tag": {
              "tr": "Orijinal Üçleme",
              "en": "Original Trilogy"
            }
          },
          {
            "until": "2005-12-31",
            "tag": {
              "tr": "Öncel Üçleme",
              "en": "Prequel Trilogy"
            }
          },
          {
            "tag": {
              "tr": "Devam Üçlemesi",
              "en": "Sequel Trilogy"
            }
          }
        ]
      },
      {
        "companies": "1",
        "genres": "878",
        "tag": {
          "tr": "Hikaye",
          "en": "Story"
        },
        "tvTag": {
          "tr": "Dizi",
          "en": "Series"
        },
        "minVotes": 40,
        "excludeTitle": "LEGO|Robot Chicken|Howard the Duck|Indiana Jones|Willow|Maniac Mansion"
      }
    ]
  },
  {
    "id": "middle-earth",
    "category": "universe",
    "name": "Orta Dünya & Tolkien Evreni",
    "nameEn": "Middle-earth & Tolkien",
    "creator": "J.R.R. Tolkien • Peter Jackson",
    "tagline": "Yüzüklerin Efendisi, Hobbit ve Güç Yüzükleri ile fantastik edebiyatın en büyük destanı.",
    "taglineEn": "The Lord of the Rings, The Hobbit and the greatest fantasy legend.",
    "accent": "#10b981",
    "gradient": "linear-gradient(135deg, rgba(16, 185, 129, 0.85) 0%, rgba(6, 78, 59, 0.95) 100%)",
    "icon": "fa-ring",
    "badge": "Lord of the Rings & Hobbit",
    "backdrop": "/kWYfW2ftGHFWgpV25yhx5aW3PJa.jpg",
    "sources": [
      {
        "collection": 119,
        "tag": {
          "tr": "Yüzüklerin Efendisi",
          "en": "The Lord of the Rings"
        }
      },
      {
        "collection": 121938,
        "tag": {
          "tr": "Hobbit",
          "en": "The Hobbit"
        }
      },
      {
        "search": "The Lord of the Rings",
        "minVotes": 100,
        "tag": {
          "tr": "Yüzüklerin Efendisi",
          "en": "The Lord of the Rings"
        },
        "tvTag": {
          "tr": "Dizi",
          "en": "Series"
        }
      }
    ]
  },
  {
    "id": "wizarding-world",
    "category": "universe",
    "name": "Büyücülük Dünyası (Wizarding World)",
    "nameEn": "Wizarding World",
    "creator": "J.K. Rowling • Warner Bros.",
    "tagline": "Hogwarts Cadılık ve Büyücülük Okulu, Harry Potter’ın yolculuğu ve Fantastik Canavarlar.",
    "taglineEn": "Hogwarts School of Witchcraft and Wizardry, Harry Potter and Fantastic Beasts.",
    "accent": "#8b5cf6",
    "gradient": "linear-gradient(135deg, rgba(139, 92, 246, 0.85) 0%, rgba(76, 29, 149, 0.95) 100%)",
    "icon": "fa-wand-magic-sparkles",
    "badge": "Harry Potter Universe",
    "backdrop": "/8r5ox4k8VvW249zL0u92zFf7bZ.jpg",
    "sources": [
      {
        "collection": 1241,
        "tag": {
          "tr": "Harry Potter",
          "en": "Harry Potter"
        }
      },
      {
        "collection": 435259,
        "tag": {
          "tr": "Fantastik Canavarlar",
          "en": "Fantastic Beasts"
        }
      },
      {
        "search": "Harry Potter",
        "media": [
          "tv"
        ],
        "tag": {
          "tr": "Dizi",
          "en": "Series"
        }
      }
    ]
  },
  {
    "id": "kubrick",
    "category": "director",
    "name": "Stanley Kubrick Başyapıtları",
    "nameEn": "Stanley Kubrick Masterpieces",
    "creator": "Stanley Kubrick",
    "tagline": "2001: A Space Odyssey, The Shining ve A Clockwork Orange gibi sinema tarihine yön veren kült eserler.",
    "taglineEn": "Cinema defining masterpieces from 2001: A Space Odyssey to The Shining.",
    "accent": "#f59e0b",
    "gradient": "linear-gradient(135deg, rgba(245, 158, 11, 0.85) 0%, rgba(120, 53, 15, 0.95) 100%)",
    "icon": "fa-clapperboard",
    "badge": "Usta Yönetmen",
    "backdrop": "/Adrip2JqnyT9NXs1b1z2e9T2W12.jpg",
    "sources": [
      {
        "person": 240,
        "tag": {
          "tr": "Yönetmen",
          "en": "Director"
        }
      }
    ]
  },
  {
    "id": "nolan",
    "category": "director",
    "name": "Christopher Nolan Sineması",
    "nameEn": "Christopher Nolan Cinema",
    "creator": "Christopher Nolan",
    "tagline": "Oppenheimer, Interstellar, Inception ve Memento ile zaman, algı ve insan zihninin sınırları.",
    "taglineEn": "Time, perception and human psyche with Oppenheimer, Interstellar and Inception.",
    "accent": "#06b6d4",
    "gradient": "linear-gradient(135deg, rgba(6, 182, 212, 0.85) 0%, rgba(14, 116, 144, 0.95) 100%)",
    "icon": "fa-hourglass-half",
    "badge": "Usta Yönetmen",
    "backdrop": "/rAiYTsgAvLlKVCRTMsqzhNDffez.jpg",
    "sources": [
      {
        "person": 525,
        "tag": {
          "tr": "Yönetmen",
          "en": "Director"
        }
      }
    ]
  },
  {
    "id": "tarantino",
    "category": "director",
    "name": "Quentin Tarantino Koleksiyonu",
    "nameEn": "Quentin Tarantino Cinema",
    "creator": "Quentin Tarantino",
    "tagline": "Pulp Fiction, Kill Bill, Django ve Soysuzlar Çetesi ile postmodern sinemanın zirve diyalogları.",
    "taglineEn": "Postmodern cinema at its peak with Pulp Fiction, Kill Bill and Django Unchained.",
    "accent": "#ef4444",
    "gradient": "linear-gradient(135deg, rgba(239, 68, 68, 0.85) 0%, rgba(153, 27, 27, 0.95) 100%)",
    "icon": "fa-gun",
    "badge": "Usta Yönetmen",
    "backdrop": "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    "sources": [
      {
        "person": 138,
        "tag": {
          "tr": "Yönetmen",
          "en": "Director"
        }
      }
    ]
  },
  {
    "id": "villeneuve",
    "category": "director",
    "name": "Denis Villeneuve Sineması",
    "nameEn": "Denis Villeneuve Cinema",
    "creator": "Denis Villeneuve",
    "tagline": "Dune, Blade Runner 2049, Arrival ve Prisoners ile atmosferik ve derin bilim kurgu şaheserleri.",
    "taglineEn": "Atmospheric sci-fi masterpieces including Dune, Blade Runner 2049 and Arrival.",
    "accent": "#d97706",
    "gradient": "linear-gradient(135deg, rgba(217, 119, 6, 0.85) 0%, rgba(146, 64, 14, 0.95) 100%)",
    "icon": "fa-mountain-sun",
    "badge": "Usta Yönetmen",
    "backdrop": "/xOMo8BRK7PfcJv9JCnx7s520DRq.jpg",
    "sources": [
      {
        "person": 137427,
        "tag": {
          "tr": "Yönetmen",
          "en": "Director"
        }
      }
    ]
  },
  {
    "id": "fincher",
    "category": "director",
    "name": "David Fincher Başyapıtları",
    "nameEn": "David Fincher Masterpieces",
    "creator": "David Fincher",
    "tagline": "Fight Club, Se7en, Gone Girl ve Zodiac ile psikolojik gerilimin ve kusursuz sinematografinin ustası.",
    "taglineEn": "Master of psychological thrillers with Fight Club, Se7en, Gone Girl and Zodiac.",
    "accent": "#64748b",
    "gradient": "linear-gradient(135deg, rgba(100, 116, 139, 0.85) 0%, rgba(30, 41, 59, 0.95) 100%)",
    "icon": "fa-fingerprint",
    "badge": "Usta Yönetmen",
    "backdrop": "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
    "sources": [
      {
        "person": 7467,
        "tag": {
          "tr": "Yönetmen",
          "en": "Director"
        }
      }
    ]
  },
  {
    "id": "miyazaki",
    "category": "director",
    "name": "Hayao Miyazaki & Studio Ghibli",
    "nameEn": "Hayao Miyazaki & Ghibli",
    "creator": "Hayao Miyazaki • Studio Ghibli",
    "tagline": "Ruhların Kaçışı, Yürüyen Şato ve Prenses Mononoke ile anime sanatının büyüleyici dünyası.",
    "taglineEn": "The magical world of anime art with Spirited Away, Howl's Moving Castle and Mononoke.",
    "accent": "#10b981",
    "gradient": "linear-gradient(135deg, rgba(16, 185, 129, 0.85) 0%, rgba(4, 120, 87, 0.95) 100%)",
    "icon": "fa-feather-pointed",
    "badge": "Usta Yönetmen / Anime",
    "backdrop": "/mSDmvumzWzQGj7b9n1q4T0F1i0B.jpg",
    "sources": [
      {
        "person": 608,
        "tag": {
          "tr": "Yönetmen",
          "en": "Director"
        }
      }
    ]
  }
];
