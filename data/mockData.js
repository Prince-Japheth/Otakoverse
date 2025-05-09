// Mock data for the entire application

export const mockData = {
  // Trending anime list
  trending: [
    {
      id: 1,
      title: "Attack on Titan",
      image: "https://example.com/aot-cover.jpg",
      rating: 9.2,
      genres: ["Action", "Drama", "Fantasy"],
      year: 2013,
      description: "In a world where humanity lives inside cities surrounded by enormous walls, a young boy named Eren joins the fight against giant creatures that threaten to destroy his home.",
      seasons: [
        {
          id: 1,
          title: "Season 1",
          image: "https://example.com/aot-s1.jpg",
          year: 2013,
          description: "The story follows Eren Yeager and his friends whose peaceful lives are disrupted by the appearance of the Titans.",
          episodes: [
            {
              number: 1,
              title: "To You, 2000 Years From Now",
              duration: "23m",
              thumbnail: "https://example.com/aot-s1e1.jpg",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              description: "On that day, humanity remembered the terror of being ruled by them, and the shame of being held captive in a birdcage..."
            },
            {
              number: 2,
              title: "That Day: The Fall of Shiganshina, Part 1",
              duration: "23m",
              thumbnail: "https://example.com/aot-s1e2.jpg",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
              description: "After the Titans break through the wall, the citizens of Shiganshina must run for their lives. However, those that do make it to safety find a harsh life waiting for them."
            },
            {
              number: 3,
              title: "A Dim Light Amid Despair: Humanity's Comeback, Part 1",
              duration: "23m",
              thumbnail: "https://example.com/aot-s1e3.jpg",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
              description: "Five years after the fall of Wall Maria, Eren, Mikasa and Armin have joined the Military Corps to fight against the Titans."
            }
          ]
        },
        {
          id: 2,
          title: "Season 2",
          image: "https://example.com/aot-s2.jpg",
          year: 2017,
          description: "As the Survey Corps deals with the aftermath of the battle against the Female Titan, new threats emerge from both inside and outside the walls.",
          episodes: [
            {
              number: 1,
              title: "Beast Titan",
              duration: "23m",
              thumbnail: "https://example.com/aot-s2e1.jpg",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
              description: "The Survey Corps discovers that their fight against the Titans is far more complicated than they originally thought."
            }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Demon Slayer",
      image: "https://example.com/ds-cover.jpg",
      rating: 9.0,
      genres: ["Action", "Supernatural"],
      year: 2019,
      description: "A young man's sister is turned into a demon, and he becomes a demon slayer to turn her back into a human and avenge his family.",
      seasons: [
        {
          id: 1,
          title: "Season 1",
          image: "https://example.com/ds-s1.jpg",
          year: 2019,
          description: "Tanjiro's journey begins as he becomes a demon slayer and searches for a cure for his sister.",
          episodes: [
            {
              number: 1,
              title: "Cruelty",
              duration: "23m",
              thumbnail: "https://example.com/ds-s1e1.jpg",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
              description: "Tanjiro returns home to find his family slaughtered and his sister turned into a demon."
            }
          ]
        }
      ]
    }
  ],

  // Recently watched list with timestamps
  recentlyWatched: [
    {
      id: 1,
      animeId: 1,
      episodeNumber: 3,
      seasonId: 1,
      timestamp: "2024-01-20T15:30:00Z",
      watchProgress: 0.7,
      lastPosition: 890,
      anime: {
        title: "Attack on Titan",
        image: "https://example.com/aot-cover.jpg",
        season: "Season 1",
        episode: "A Dim Light Amid Despair: Humanity's Comeback, Part 1"
      }
    },
    {
      id: 2,
      animeId: 2,
      episodeNumber: 1,
      seasonId: 1,
      timestamp: "2024-01-19T20:15:00Z",
      watchProgress: 1.0,
      lastPosition: 1380,
      anime: {
        title: "Demon Slayer",
        image: "https://example.com/ds-cover.jpg",
        season: "Season 1",
        episode: "Cruelty"
      }
    }
  ],

  // User's favorites
  favorites: [
    {
      id: 1,
      dateAdded: "2024-01-15T10:20:00Z",
      anime: {
        id: 1,
        title: "Attack on Titan",
        image: "https://example.com/aot-cover.jpg",
        rating: 9.2,
        genres: ["Action", "Drama", "Fantasy"]
      }
    },
    // Add more favorites...
  ],

  // Home screen featured content
  featured: [
    {
      id: 1,
      title: "Demon Slayer",
      image: "https://example.com/ds-cover.jpg",
      bannerImage: "https://example.com/ds-banner.jpg",
      rating: 9.0,
      genres: ["Action", "Supernatural"],
      year: 2019,
      description: "A young man's sister is turned into a demon, and he becomes a demon slayer to turn her back into a human and avenge his family.",
      seasons: [
        {
          id: 1,
          title: "Season 1",
          image: "https://example.com/ds-s1.jpg",
          year: 2019,
          description: "Tanjiro's journey begins as he becomes a demon slayer and searches for a cure for his sister.",
          episodes: [
            {
              number: 1,
              title: "Cruelty",
              duration: "23m",
              thumbnail: "https://example.com/ds-s1e1.jpg",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            },
            // Add more episodes...
          ]
        },
        // Add more seasons...
      ]
    },
    // Add more featured content...
  ],

  // Video sources mapping
  videoSources: {
    1: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    2: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    3: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    4: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    5: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
  },

  // Common anime details structure
  animeDetails: {
    1: {
      id: 1,
      title: "Attack on Titan",
      originalTitle: "進撃の巨人",
      image: "https://example.com/aot-cover.jpg",
      bannerImage: "https://example.com/aot-banner.jpg",
      rating: 9.2,
      genres: ["Action", "Drama", "Fantasy"],
      year: 2013,
      status: "Completed",
      totalEpisodes: 75,
      description: "In a world where humanity lives inside cities surrounded by enormous walls, a young boy named Eren joins the fight against giant creatures that threaten to destroy his home.",
      studio: "MAPPA",
      seasons: [
        {
          id: 1,
          title: "Season 1",
          image: "https://example.com/aot-s1.jpg",
          year: 2013,
          episodes: [
            {
              number: 1,
              title: "To You, 2000 Years From Now",
              duration: "23m",
              thumbnail: "https://example.com/aot-s1e1.jpg",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              description: "On that day, humanity remembered the terror of being ruled by them, and the shame of being held captive in a birdcage..."
            },
            // Add more episodes...
          ]
        },
        // Add more seasons...
      ],
      related: [
        {
          id: 2,
          title: "Demon Slayer",
          image: "https://example.com/ds-cover.jpg",
          rating: 9.0,
          genres: ["Action", "Supernatural"]
        },
        // Add more related anime...
      ]
    },
    // Add more anime details...
  }
}

export const featuredContent = [
  {
    id: 1,
    title: 'Dandadan',
    image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/06/dandadan-2024.jpg?q=49&fit=crop&w=480&dpr=2',
    rating: "16+",
    episodes: "12",
    status: "New • Season 1",
    description: "A supernatural comedy following Momo Ayase and Okarun as they investigate paranormal phenomena while dealing with their own personal issues."
  },
  {
    id: 2,
    title: 'Vinland Saga',
    image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/04/vinland-saga-poster-4.jpg?q=49&fit=crop&w=480&dpr=2',
    rating: "18+",
    episodes: "48",
    status: "Complete • Season 1-2",
    description: "A historical epic following Thorfinn's journey from a vengeful warrior to a peaceful explorer in medieval Europe."
  },
  {
    id: 3,
    title: 'Death Note',
    image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/06/death-note-2006.jpg?q=49&fit=crop&w=480&dpr=2',
    rating: "16+",
    episodes: "37",
    status: "Complete • Season 1",
    description: "A psychological thriller about a high school student who discovers a supernatural notebook that can kill anyone whose name is written in it."
  },
];

export const recentWatched = [
  {
    title: 'Neon Genesis Evangelion',
    image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/07/neon-genesis-evangelion.jpg?q=49&fit=crop&w=480&dpr=2',
    rating: "14+",
    episodes: "26",
    status: "Complete • Season 1",
    description: "A groundbreaking mecha series that explores deep psychological themes and human nature through the eyes of young pilots."
  },
  {
    title: 'Baccano!',
    image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/07/baccano-1.jpg?q=49&fit=crop&w=480&dpr=2',
    rating: "16+",
    episodes: "13",
    status: "Complete • Season 1",
    description: "A non-linear narrative following various characters in 1930s America, involving immortals, gangsters, and a mysterious elixir."
  },
  {
    title: 'Gintama',
    image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/06/gintama-2005.jpg?q=70&fit=crop&w=480&dpr=1',
    rating: "14+",
    episodes: "367",
    status: "Complete • Season 1-4",
    description: "A comedic samurai series set in an alternate Edo period where aliens have taken over Japan."
  },
];

export const myFavorites = [
  {
    title: 'Code Geass: Lelouch of the Rebellion',
    image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/04/code-geass-lelouch-of-the-rebellion-2006.jpg?q=49&fit=crop&w=480&dpr=2',
    rating: "16+",
    episodes: "50",
    status: "Complete • Season 1-2",
    description: "A complex political drama following Lelouch as he seeks to overthrow the Holy Britannian Empire using his newfound power of Geass."
  },
  {
    title: 'Haikyuu!!',
    image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/08/haikyuu.jpg?q=49&fit=crop&w=480&dpr=2',
    rating: "12+",
    episodes: "85",
    status: "Complete • Season 1-4",
    description: "An inspiring sports anime following Shoyo Hinata's journey to become a great volleyball player despite his short stature."
  },
  {
    title: 'One Punch Man',
    image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/2024/09/mv5bzjjlnze5yzetyzqwys00ntbjltk5yzatyzuwowqym2e3ogi2xkeyxkfqcgdeqxvyntgynta4mjm-_v1_.jpg?q=49&fit=crop&w=480&dpr=2',
    rating: "14+",
    episodes: "24",
    status: "Ongoing • Season 2",
    description: "A satirical superhero series following Saitama, who can defeat any opponent with a single punch but struggles with boredom."
  },
];

export const animeSeasons = [
  {
    number: 1,
    title: "Season 1",
    episodes: [
      {
        number: 1,
        title: "To You, in 2000 Years",
        duration: "24:05",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnail: "https://picsum.photos/seed/attack1/280/157"
      },
      {
        number: 2,
        title: "That Day",
        duration: "23:40",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        thumbnail: "https://picsum.photos/seed/attack2/280/157"
      },
      {
        number: 3,
        title: "A Dim Light Amidst Despair",
        duration: "23:55",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumbnail: "https://picsum.photos/seed/attack3/280/157"
      }
    ],
    image: "https://picsum.photos/seed/attack/400/225",
    year: "2013",
    description: "The first season of Attack on Titan introduces the world of humanity's struggle against the Titans."
  },
  {
    number: 2,
    title: "Season 2",
    episodes: [
      {
        number: 1,
        title: "Beast Titan",
        duration: "23:50",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        thumbnail: "https://picsum.photos/seed/attack4/280/157"
      },
      {
        number: 2,
        title: "I'm Home",
        duration: "24:10",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        thumbnail: "https://picsum.photos/seed/attack5/280/157"
      }
    ],
    image: "https://picsum.photos/seed/attack2/400/225",
    year: "2017",
    description: "The second season continues the story with new revelations about the Titans and the world."
  }
];

export const animeTags = [
  "16+",
  "League of Legends",
  "Netflix",
  "Action",
  "Drama",
  "Fantasy"
];