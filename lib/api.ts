// This is a mock API service for the streaming platform
// In a real application, these functions would make actual API calls

// Mock data - expanded with more content and metadata
const mockVideos = [
  {
    id: "1",
    title: "Stranger Things",
    description:
      "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
    thumbnail: "/placeholder.svg?height=169&width=300",
    poster: "/placeholder.svg?height=600&width=400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    category: "tv-show",
    releaseYear: "2016",
    releaseDate: "July 15, 2016",
    duration: "4 Seasons",
    rating: "TV-14",
    genres: ["Horror", "Sci-Fi", "Drama"],
    dateAdded: "2023-12-15",
    popularity: 98,
    trending: true,
    episodeCount: 32,
    cast: [
      { name: "Millie Bobby Brown", role: "Eleven", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Finn Wolfhard", role: "Mike Wheeler", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Winona Ryder", role: "Joyce Byers", photo: "/placeholder.svg?height=100&width=100" },
      { name: "David Harbour", role: "Jim Hopper", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Gaten Matarazzo", role: "Dustin Henderson", photo: "/placeholder.svg?height=100&width=100" },
    ],
    directors: ["The Duffer Brothers"],
    creators: ["The Duffer Brothers"],
    userRating: 4.8,
    reviews: [
      {
        id: "r1",
        user: "MovieFan123",
        rating: 5,
        comment: "Best show ever! Can't wait for the next season!",
        date: "2023-10-15",
      },
      {
        id: "r2",
        user: "SciFiLover",
        rating: 4,
        comment: "Great storyline and amazing characters.",
        date: "2023-09-22",
      },
      {
        id: "r3",
        user: "CriticGuy",
        rating: 4,
        comment: "Excellent production value and nostalgic vibes.",
        date: "2023-08-30",
      },
    ],
  },
  {
    id: "2",
    title: "The Crown",
    description:
      "This drama follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the 20th century.",
    thumbnail: "/placeholder.svg?height=169&width=300",
    poster: "/placeholder.svg?height=600&width=400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    category: "tv-show",
    releaseYear: "2016",
    releaseDate: "November 4, 2016",
    duration: "4 Seasons",
    rating: "TV-MA",
    genres: ["Drama", "History", "Biography"],
    dateAdded: "2023-11-20",
    popularity: 85,
    trending: false,
    episodeCount: 40,
    cast: [
      { name: "Olivia Colman", role: "Queen Elizabeth II", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Tobias Menzies", role: "Prince Philip", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Helena Bonham Carter", role: "Princess Margaret", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Josh O'Connor", role: "Prince Charles", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Emma Corrin", role: "Princess Diana", photo: "/placeholder.svg?height=100&width=100" },
    ],
    directors: ["Benjamin Caron", "Stephen Daldry", "Philip Martin"],
    creators: ["Peter Morgan"],
    userRating: 4.7,
    reviews: [
      {
        id: "r4",
        user: "HistoryBuff",
        rating: 5,
        comment: "Incredible attention to historical detail!",
        date: "2023-11-05",
      },
      {
        id: "r5",
        user: "RoyalWatcher",
        rating: 4,
        comment: "Fascinating portrayal of the royal family.",
        date: "2023-10-12",
      },
    ],
  },
  {
    id: "3",
    title: "Inception",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    thumbnail: "/placeholder.svg?height=169&width=300",
    poster: "/placeholder.svg?height=600&width=400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    category: "movie",
    releaseYear: "2010",
    releaseDate: "July 16, 2010",
    duration: "2h 28m",
    rating: "PG-13",
    genres: ["Action", "Sci-Fi", "Thriller"],
    dateAdded: "2023-10-05",
    popularity: 92,
    trending: false,
    cast: [
      { name: "Leonardo DiCaprio", role: "Cobb", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Joseph Gordon-Levitt", role: "Arthur", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Ellen Page", role: "Ariadne", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Tom Hardy", role: "Eames", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Ken Watanabe", role: "Saito", photo: "/placeholder.svg?height=100&width=100" },
    ],
    directors: ["Christopher Nolan"],
    writers: ["Christopher Nolan"],
    userRating: 4.9,
    reviews: [
      { id: "r6", user: "FilmCritic", rating: 5, comment: "A masterpiece of modern cinema!", date: "2023-09-18" },
      {
        id: "r7",
        user: "NolanFan",
        rating: 5,
        comment: "Mind-bending plot and incredible visuals.",
        date: "2023-08-25",
      },
      { id: "r8", user: "MovieGoer", rating: 4, comment: "Complex but rewarding storyline.", date: "2023-07-30" },
    ],
  },
  {
    id: "4",
    title: "Money Heist",
    description:
      "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.",
    thumbnail: "/placeholder.svg?height=169&width=300",
    poster: "/placeholder.svg?height=600&width=400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    category: "tv-show",
    releaseYear: "2017",
    releaseDate: "May 2, 2017",
    duration: "5 Seasons",
    rating: "TV-MA",
    genres: ["Crime", "Drama", "Thriller"],
    dateAdded: "2023-09-18",
    popularity: 95,
    trending: true,
    episodeCount: 41,
    cast: [
      { name: "Úrsula Corberó", role: "Tokyo", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Álvaro Morte", role: "The Professor", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Itziar Ituño", role: "Raquel Murillo", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Pedro Alonso", role: "Berlin", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Miguel Herrán", role: "Rio", photo: "/placeholder.svg?height=100&width=100" },
    ],
    directors: ["Jesús Colmenar", "Koldo Serra", "Álex Rodrigo"],
    creators: ["Álex Pina"],
    userRating: 4.6,
    reviews: [
      {
        id: "r9",
        user: "ThrillerFan",
        rating: 5,
        comment: "Edge-of-your-seat excitement in every episode!",
        date: "2023-10-20",
      },
      {
        id: "r10",
        user: "BingeWatcher",
        rating: 4,
        comment: "Addictive storyline and great character development.",
        date: "2023-09-15",
      },
    ],
  },
  {
    id: "5",
    title: "The Dark Knight",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    thumbnail: "/placeholder.svg?height=169&width=300",
    poster: "/placeholder.svg?height=600&width=400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    category: "movie",
    releaseYear: "2008",
    releaseDate: "July 18, 2008",
    duration: "2h 32m",
    rating: "PG-13",
    genres: ["Action", "Crime", "Drama"],
    dateAdded: "2023-08-30",
    popularity: 96,
    trending: false,
    cast: [
      { name: "Christian Bale", role: "Bruce Wayne / Batman", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Heath Ledger", role: "Joker", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Aaron Eckhart", role: "Harvey Dent", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Michael Caine", role: "Alfred", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Gary Oldman", role: "Jim Gordon", photo: "/placeholder.svg?height=100&width=100" },
    ],
    directors: ["Christopher Nolan"],
    writers: ["Jonathan Nolan", "Christopher Nolan"],
    userRating: 4.9,
    reviews: [
      { id: "r11", user: "DCFan", rating: 5, comment: "The best superhero movie ever made!", date: "2023-08-10" },
      { id: "r12", user: "MovieBuff", rating: 5, comment: "Heath Ledger's Joker is legendary.", date: "2023-07-22" },
      {
        id: "r13",
        user: "FilmStudent",
        rating: 5,
        comment: "A masterclass in filmmaking and storytelling.",
        date: "2023-06-15",
      },
    ],
  },
  {
    id: "6",
    title: "Breaking Bad",
    description:
      "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    thumbnail: "/placeholder.svg?height=169&width=300",
    poster: "/placeholder.svg?height=600&width=400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    category: "tv-show",
    releaseYear: "2008",
    releaseDate: "January 20, 2008",
    duration: "5 Seasons",
    rating: "TV-MA",
    genres: ["Crime", "Drama", "Thriller"],
    dateAdded: "2024-01-05",
    popularity: 99,
    trending: true,
    episodeCount: 62,
    cast: [
      { name: "Bryan Cranston", role: "Walter White", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Aaron Paul", role: "Jesse Pinkman", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Anna Gunn", role: "Skyler White", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Dean Norris", role: "Hank Schrader", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Betsy Brandt", role: "Marie Schrader", photo: "/placeholder.svg?height=100&width=100" },
    ],
    directors: ["Vince Gilligan", "Michelle MacLaren", "Adam Bernstein"],
    creators: ["Vince Gilligan"],
    userRating: 4.8,
    reviews: [
      {
        id: "r14",
        user: "TVAddict",
        rating: 5,
        comment: "One of the greatest TV shows of all time!",
        date: "2024-01-10",
      },
      {
        id: "r15",
        user: "DramaLover",
        rating: 5,
        comment: "Intense, gripping, and unforgettable.",
        date: "2023-12-28",
      },
    ],
  },
  {
    id: "7",
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    thumbnail: "/placeholder.svg?height=169&width=300",
    poster: "/placeholder.svg?height=600&width=400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    category: "movie",
    releaseYear: "2014",
    releaseDate: "November 7, 2014",
    duration: "2h 49m",
    rating: "PG-13",
    genres: ["Adventure", "Drama", "Sci-Fi"],
    dateAdded: "2024-02-10",
    popularity: 91,
    trending: true,
    cast: [
      { name: "Matthew McConaughey", role: "Cooper", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Anne Hathaway", role: "Brand", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Jessica Chastain", role: "Murph", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Michael Caine", role: "Professor Brand", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Matt Damon", role: "Mann", photo: "/placeholder.svg?height=100&width=100" },
    ],
    directors: ["Christopher Nolan"],
    writers: ["Jonathan Nolan", "Christopher Nolan"],
    userRating: 4.7,
    reviews: [
      {
        id: "r16",
        user: "SpaceExplorer",
        rating: 5,
        comment: "A visually stunning and thought-provoking film.",
        date: "2024-02-15",
      },
      {
        id: "r17",
        user: "SciFiFanatic",
        rating: 4,
        comment: "Complex themes and breathtaking visuals.",
        date: "2024-02-01",
      },
    ],
  },
  {
    id: "8",
    title: "The Queen's Gambit",
    description:
      "Orphaned at the tender age of nine, prodigious introvert Beth Harmon discovers and masters the game of chess in 1960s USA. But child stardom comes at a price.",
    thumbnail: "/placeholder.svg?height=169&width=300",
    poster: "/placeholder.svg?height=600&width=400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    category: "tv-show",
    releaseYear: "2020",
    releaseDate: "October 23, 2020",
    duration: "1 Season",
    rating: "TV-MA",
    genres: ["Drama"],
    dateAdded: "2024-01-20",
    popularity: 88,
    trending: true,
    episodeCount: 7,
    cast: [
      { name: "Anya Taylor-Joy", role: "Beth Harmon", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Bill Camp", role: "Mr. Shaibel", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Marielle Heller", role: "Alma Wheatley", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Thomas Brodie-Sangster", role: "Benny Watts", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Harry Melling", role: "Harry Beltik", photo: "/placeholder.svg?height=100&width=100" },
    ],
    directors: ["Scott Frank"],
    creators: ["Scott Frank", "Allan Scott"],
    userRating: 4.6,
    reviews: [
      {
        id: "r18",
        user: "ChessFan",
        rating: 5,
        comment: "A captivating story with brilliant performances.",
        date: "2024-01-28",
      },
      { id: "r19", user: "DramaQueen", rating: 4, comment: "Stylish and engaging miniseries.", date: "2024-01-15" },
    ],
  },
  {
    id: "9",
    title: "The Shawshank Redemption",
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    thumbnail: "/placeholder.svg?height=169&width=300",
    poster: "/placeholder.svg?height=600&width=400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    category: "movie",
    releaseYear: "1994",
    releaseDate: "September 23, 1994",
    duration: "2h 22m",
    rating: "R",
    genres: ["Drama"],
    dateAdded: "2023-07-15",
    popularity: 97,
    trending: false,
    cast: [
      { name: "Tim Robbins", role: "Andy Dufresne", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Morgan Freeman", role: "Ellis Boyd 'Red' Redding", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Bob Gunton", role: "Warden Samuel Norton", photo: "/placeholder.svg?height=100&width=100" },
      { name: "William Sadler", role: "Heywood", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Clancy Brown", role: "Captain Byron Hadley", photo: "/placeholder.svg?height=100&width=100" },
    ],
    directors: ["Frank Darabont"],
    writers: ["Stephen King", "Frank Darabont"],
    userRating: 4.9,
    reviews: [
      {
        id: "r20",
        user: "MovieLover",
        rating: 5,
        comment: "A timeless classic that everyone should see.",
        date: "2023-07-20",
      },
      {
        id: "r21",
        user: "DramaFanatic",
        rating: 5,
        comment: "A powerful story of hope and redemption.",
        date: "2023-07-01",
      },
    ],
  },
  {
    id: "10",
    title: "Game of Thrones",
    description:
      "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
    thumbnail: "/placeholder.svg?height=169&width=300",
    poster: "/placeholder.svg?height=600&width=400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    category: "tv-show",
    releaseYear: "2011",
    releaseDate: "April 17, 2011",
    duration: "8 Seasons",
    rating: "TV-MA",
    genres: ["Action", "Adventure", "Drama"],
    dateAdded: "2023-06-20",
    popularity: 94,
    trending: false,
    episodeCount: 73,
    cast: [
      { name: "Emilia Clarke", role: "Daenerys Targaryen", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Kit Harington", role: "Jon Snow", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Peter Dinklage", role: "Tyrion Lannister", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Lena Headey", role: "Cersei Lannister", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Sophie Turner", role: "Sansa Stark", photo: "/placeholder.svg?height=100&width=100" },
    ],
    directors: ["David Benioff", "D.B. Weiss", "Alan Taylor"],
    creators: ["David Benioff", "D.B. Weiss"],
    userRating: 4.5,
    reviews: [
      { id: "r22", user: "FantasyFan", rating: 5, comment: "Epic in every sense of the word!", date: "2023-06-25" },
      { id: "r23", user: "GOTLover", rating: 4, comment: "A must-watch for fantasy enthusiasts.", date: "2023-06-10" },
    ],
  },
  {
    id: "11",
    title: "The Mandalorian",
    description:
      "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.",
    thumbnail: "/placeholder.svg?height=169&width=300",
    poster: "/placeholder.svg?height=600&width=400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    category: "tv-show",
    releaseYear: "2019",
    releaseDate: "November 12, 2019",
    duration: "3 Seasons",
    rating: "TV-14",
    genres: ["Action", "Adventure", "Sci-Fi"],
    dateAdded: "2024-02-28",
    popularity: 93,
    trending: true,
    episodeCount: 24,
    cast: [
      { name: "Pedro Pascal", role: "The Mandalorian", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Giancarlo Esposito", role: "Moff Gideon", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Carl Weathers", role: "Greef Karga", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Katee Sackhoff", role: "Bo-Katan Kryze", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Ming-Na Wen", role: "Fennec Shand", photo: "/placeholder.svg?height=100&width=100" },
    ],
    directors: ["Jon Favreau", "Dave Filoni", "Bryce Dallas Howard"],
    creators: ["Jon Favreau"],
    userRating: 4.7,
    reviews: [
      {
        id: "r24",
        user: "StarWarsFan",
        rating: 5,
        comment: "A fantastic addition to the Star Wars universe!",
        date: "2024-03-05",
      },
      {
        id: "r25",
        user: "ActionLover",
        rating: 4,
        comment: "Exciting action and great characters.",
        date: "2024-02-20",
      },
    ],
  },
  {
    id: "12",
    title: "Dune",
    description:
      "Feature adaptation of Frank Herbert's science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.",
    thumbnail: "/placeholder.svg?height=169&width=300",
    poster: "/placeholder.svg?height=600&width=400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    category: "movie",
    releaseYear: "2021",
    releaseDate: "October 22, 2021",
    duration: "2h 35m",
    rating: "PG-13",
    genres: ["Action", "Adventure", "Sci-Fi"],
    dateAdded: "2024-03-01",
    popularity: 90,
    trending: true,
    cast: [
      { name: "Timothée Chalamet", role: "Paul Atreides", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Rebecca Ferguson", role: "Lady Jessica", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Oscar Isaac", role: "Duke Leto Atreides", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Josh Brolin", role: "Gurney Halleck", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Zendaya", role: "Chani", photo: "/placeholder.svg?height=100&width=100" },
    ],
    directors: ["Denis Villeneuve"],
    writers: ["Jon Spaihts", "Denis Villeneuve", "Eric Roth"],
    userRating: 4.6,
    reviews: [
      {
        id: "r26",
        user: "SciFiMaster",
        rating: 5,
        comment: "A visually stunning and faithful adaptation.",
        date: "2024-03-08",
      },
      {
        id: "r27",
        user: "DuneFanatic",
        rating: 4,
        comment: "Epic in scope and beautifully realized.",
        date: "2024-02-25",
      },
    ],
  },
  {
    id: "13",
    title: "The Witcher",
    description:
      "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
    thumbnail: "/placeholder.svg?height=169&width=300",
    poster: "/placeholder.svg?height=600&width=400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    category: "tv-show",
    releaseYear: "2019",
    releaseDate: "December 20, 2019",
    duration: "2 Seasons",
    rating: "TV-MA",
    genres: ["Action", "Adventure", "Fantasy"],
    dateAdded: "2023-12-05",
    popularity: 89,
    trending: false,
    episodeCount: 16,
    cast: [
      { name: "Henry Cavill", role: "Geralt of Rivia", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Anya Chalotra", role: "Yennefer of Vengerberg", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Freya Allan", role: "Ciri", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Joey Batey", role: "Jaskier", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Eamon Farren", role: "Cahir", photo: "/placeholder.svg?height=100&width=100" },
    ],
    directors: ["Alik Sakharov", "Charlotte Brändström", "Alex Garcia Lopez"],
    creators: ["Lauren Schmidt Hissrich"],
    userRating: 4.4,
    reviews: [
      {
        id: "r28",
        user: "FantasyLover",
        rating: 5,
        comment: "A great adaptation of the Witcher books!",
        date: "2023-12-10",
      },
      {
        id: "r29",
        user: "ActionFanatic",
        rating: 4,
        comment: "Exciting action and a compelling storyline.",
        date: "2023-11-28",
      },
    ],
  },
  {
    id: "14",
    title: "Joker",
    description:
      "In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime. This path brings him face-to-face with his alter-ego: the Joker.",
    thumbnail: "/placeholder.svg?height=169&width=300",
    poster: "/placeholder.svg?height=600&width=400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    category: "movie",
    releaseYear: "2019",
    releaseDate: "October 4, 2019",
    duration: "2h 2m",
    rating: "R",
    genres: ["Crime", "Drama", "Thriller"],
    dateAdded: "2023-11-10",
    popularity: 87,
    trending: false,
    cast: [
      { name: "Joaquin Phoenix", role: "Arthur Fleck / Joker", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Robert De Niro", role: "Murray Franklin", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Zazie Beetz", role: "Sophie Dumond", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Frances Conroy", role: "Penny Fleck", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Brett Cullen", role: "Thomas Wayne", photo: "/placeholder.svg?height=100&width=100" },
    ],
    directors: ["Todd Phillips"],
    writers: ["Todd Phillips", "Scott Silver"],
    userRating: 4.5,
    reviews: [
      {
        id: "r30",
        user: "MovieCritic",
        rating: 5,
        comment: "A brilliant and disturbing portrayal of a descent into madness.",
        date: "2023-11-15",
      },
      {
        id: "r31",
        user: "ThrillerFanatic",
        rating: 4,
        comment: "Joaquin Phoenix delivers an unforgettable performance.",
        date: "2023-11-01",
      },
    ],
  },
  {
    id: "15",
    title: "Squid Game",
    description:
      "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
    thumbnail: "/placeholder.svg?height=169&width=300",
    poster: "/placeholder.svg?height=600&width=400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    category: "tv-show",
    releaseYear: "2021",
    releaseDate: "September 17, 2021",
    duration: "1 Season",
    rating: "TV-MA",
    genres: ["Action", "Drama", "Mystery"],
    dateAdded: "2024-01-15",
    popularity: 95,
    trending: true,
    episodeCount: 9,
    cast: [
      { name: "Lee Jung-jae", role: "Seong Gi-hun", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Park Hae-soo", role: "Cho Sang-woo", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Wi Ha-joon", role: "Hwang Jun-ho", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Jung Ho-yeon", role: "Kang Sae-byeok", photo: "/placeholder.svg?height=100&width=100" },
      { name: "Oh Young-soo", role: "Oh Il-nam", photo: "/placeholder.svg?height=100&width=100" },
    ],
    directors: ["Hwang Dong-hyuk"],
    writers: ["Hwang Dong-hyuk"],
    creators: ["Hwang Dong-hyuk"],
    userRating: 4.6,
    reviews: [
      {
        id: "r32",
        user: "KoreanDramaFan",
        rating: 5,
        comment: "A thrilling and thought-provoking series.",
        date: "2024-01-20",
      },
      { id: "r33", user: "MysteryLover", rating: 4, comment: "Addictive and full of suspense.", date: "2024-01-10" },
    ],
  },
]

// Mock user data - expanded with continue watching
const mockWatchlist = [
  {
    id: "3",
    title: "Inception",
    thumbnail: "/placeholder.svg?height=169&width=300",
    releaseYear: "2010",
    duration: "2h 28m",
  },
  {
    id: "5",
    title: "The Dark Knight",
    thumbnail: "/placeholder.svg?height=169&width=300",
    releaseYear: "2008",
    duration: "2h 32m",
  },
]

const mockHistory = [
  {
    id: "1",
    title: "Stranger Things",
    thumbnail: "/placeholder.svg?height=169&width=300",
    releaseYear: "2016",
    duration: "4 Seasons",
    progress: 65,
    lastWatched: "2024-03-10",
  },
  {
    id: "2",
    title: "The Crown",
    thumbnail: "/placeholder.svg?height=169&width=300",
    releaseYear: "2016",
    duration: "4 Seasons",
    progress: 30,
    lastWatched: "2024-03-05",
  },
  {
    id: "6",
    title: "Breaking Bad",
    thumbnail: "/placeholder.svg?height=169&width=300",
    releaseYear: "2008",
    duration: "5 Seasons",
    progress: 45,
    lastWatched: "2024-03-12",
  },
  {
    id: "8",
    title: "The Queen's Gambit",
    thumbnail: "/placeholder.svg?height=169&width=300",
    releaseYear: "2020",
    duration: "1 Season",
    progress: 80,
    lastWatched: "2024-03-08",
  },
  {
    id: "12",
    title: "Dune",
    thumbnail: "/placeholder.svg?height=169&width=300",
    releaseYear: "2021",
    duration: "2h 35m",
    progress: 25,
    lastWatched: "2024-03-11",
  },
]

// API functions
export async function getVideoById(id: string): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const video = mockVideos.find((v) => v.id === id)
  if (!video) {
    throw new Error("Video not found")
  }

  return video
}

export async function getVideoDetails(id: string): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  console.log(`API: Looking for video with ID: ${id}`)
  console.log(
    `API: Available IDs:`,
    mockVideos.map((v) => v.id),
  )

  const video = mockVideos.find((v) => v.id === id)
  if (!video) {
    console.error(`API: Video with ID ${id} not found`)
    throw new Error(`Video with ID ${id} not found`)
  }

  console.log(`API: Found video:`, video.title)
  // In a real app, this would fetch additional details like cast, reviews, etc.
  return video
}

export async function getAllVideos(): Promise<any[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [...mockVideos]
}

export async function getMovies(filters = {}): Promise<any[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredMovies = mockVideos.filter((video) => video.category === "movie")

  // Apply filters if provided
  if (Object.keys(filters).length > 0) {
    filteredMovies = applyFilters(filteredMovies, filters)
  }

  return filteredMovies
}

export async function getTVShows(filters = {}): Promise<any[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  try {
    let filteredShows = mockVideos.filter((video) => video.category === "tv-show")

    // Apply filters if provided
    if (Object.keys(filters).length > 0) {
      filteredShows = applyFilters(filteredShows, filters)
    }

    return filteredShows
  } catch (error) {
    console.error("Error in getTVShows:", error)
    // Return empty array instead of throwing to prevent chunk loading issues
    return []
  }
}

export async function getNewReleases(limit = 10): Promise<any[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  // Sort by date added (newest first) and limit results
  return [...mockVideos]
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, limit)
}

export async function getPopularContent(limit = 10): Promise<any[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  // Sort by popularity (highest first) and limit results
  return [...mockVideos].sort((a, b) => b.popularity - a.popularity).slice(0, limit)
}

export async function getTrendingContent(limit = 10): Promise<any[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  // Filter trending content and limit results
  return mockVideos.filter((video) => video.trending).slice(0, limit)
}

export async function getContinueWatching(userId: string): Promise<any[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  // In a real app, this would filter by userId
  // Sort by last watched date (most recent first)
  return [...mockHistory].sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime())
}

export async function searchVideos(query: string): Promise<any[]> {
  // Reduced delay for real-time search (200ms instead of 800ms)
  await new Promise((resolve) => setTimeout(resolve, 200))

  const normalizedQuery = query.toLowerCase()
  return mockVideos.filter(
    (video) =>
      video.title.toLowerCase().includes(normalizedQuery) ||
      video.description.toLowerCase().includes(normalizedQuery) ||
      video.genres.some((genre) => genre.toLowerCase().includes(normalizedQuery)),
  )
}

export async function getUserWatchlist(userId: string): Promise<any[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  // In a real app, this would filter by userId
  return [...mockWatchlist]
}

export async function getUserHistory(userId: string): Promise<any[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  // In a real app, this would filter by userId
  return [...mockHistory]
}

export async function saveVideo(videoData: any): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, this would save to a database
  const existingIndex = mockVideos.findIndex((v) => v.id === videoData.id)

  if (existingIndex >= 0) {
    // Update existing video
    mockVideos[existingIndex] = videoData
  } else {
    // Add new video
    mockVideos.push(videoData)
  }

  return videoData
}

export async function deleteVideo(videoId: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // In a real app, this would delete from a database
  const index = mockVideos.findIndex((v) => v.id === videoId)
  if (index >= 0) {
    mockVideos.splice(index, 1)
  }
}

export async function addToWatchlist(userId: string, videoId: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  // In a real app, this would add to a user's watchlist in a database
  const video = mockVideos.find((v) => v.id === videoId)
  if (!video) {
    throw new Error("Video not found")
  }

  const existingIndex = mockWatchlist.findIndex((w) => w.id === videoId)
  if (existingIndex === -1) {
    mockWatchlist.push({
      id: video.id,
      title: video.title,
      thumbnail: video.thumbnail,
      releaseYear: video.releaseYear,
      duration: video.duration,
    })
  }
}

export async function removeFromWatchlist(userId: string, videoId: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  // In a real app, this would remove from a user's watchlist in a database
  const existingIndex = mockWatchlist.findIndex((w) => w.id === videoId)
  if (existingIndex >= 0) {
    mockWatchlist.splice(existingIndex, 1)
  }
}

export async function submitReview(videoId: string, userId: string, rating: number, comment: string): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  // In a real app, this would save the review to a database
  const video = mockVideos.find((v) => v.id === videoId)
  if (!video) {
    throw new Error("Video not found")
  }

  const newReview = {
    id: `r${Date.now()}`,
    user: userId,
    rating,
    comment,
    date: new Date().toISOString().split("T")[0],
  }

  if (!video.reviews) {
    video.reviews = []
  }

  video.reviews.push(newReview)

  // Recalculate average rating
  const totalRating = video.reviews.reduce((sum, review) => sum + review.rating, 0)
  video.userRating = totalRating / video.reviews.length

  return newReview
}

// Helper function to apply filters
function applyFilters(videos, filters) {
  let filteredVideos = [...videos]

  if (filters.genre) {
    filteredVideos = filteredVideos.filter((video) =>
      video.genres.some((genre) => genre.toLowerCase() === filters.genre.toLowerCase()),
    )
  }

  if (filters.year) {
    filteredVideos = filteredVideos.filter((video) => video.releaseYear === filters.year)
  }

  if (filters.rating) {
    filteredVideos = filteredVideos.filter((video) => video.rating === filters.rating)
  }

  // Sort functionality
  if (filters.sort) {
    switch (filters.sort) {
      case "newest":
        filteredVideos.sort((a, b) => Number.parseInt(b.releaseYear) - Number.parseInt(a.releaseYear))
        break
      case "oldest":
        filteredVideos.sort((a, b) => Number.parseInt(a.releaseYear) - Number.parseInt(b.releaseYear))
        break
      case "az":
        filteredVideos.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "za":
        filteredVideos.sort((a, b) => b.title.localeCompare(a.title))
        break
      case "popularity":
        filteredVideos.sort((a, b) => b.popularity - a.popularity)
        break
      default:
        break
    }
  }

  return filteredVideos
}

export async function isInWatchlist(userId: string, videoId: string): Promise<boolean> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  // In a real app, this would check the user's watchlist in a database
  const existingIndex = mockWatchlist.findIndex((w) => w.id === videoId)
  return existingIndex !== -1
}
