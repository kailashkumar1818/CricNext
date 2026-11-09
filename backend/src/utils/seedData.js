import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { News } from '../models/News.js';
import { Team } from '../models/Team.js';
import { Player } from '../models/Player.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const mongoUri = (process.env.MONGO_URI || process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/cricbuzz_db').trim();

const teamsData = [
  {
    name: 'India',
    code: 'IND',
    logoUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=120&q=80',
    captain: 'Rohit Sharma',
    coach: 'Gautam Gambhir',
    ranking: { test: 2, odi: 1, t20: 1 },
    points: { test: 120, odi: 118, t20: 265 },
    overview: 'The Indian Men’s Cricket Team, also known as the Men in Blue, is governed by the BCCI. One of the strongest international sides across all three formats.',
    primaryColor: '#0055A5',
    trophies: [
      { tournament: 'ICC Cricket World Cup', year: 1983 },
      { tournament: 'ICC Cricket World Cup', year: 2011 },
      { tournament: 'ICC T20 World Cup', year: 2007 },
      { tournament: 'ICC T20 World Cup', year: 2024 },
      { tournament: 'ICC Champions Trophy', year: 2013 }
    ]
  },
  {
    name: 'Australia',
    code: 'AUS',
    logoUrl: 'https://images.unsplash.com/photo-1531415074868-83633dd5e457?auto=format&fit=crop&w=120&q=80',
    captain: 'Pat Cummins',
    coach: 'Andrew McDonald',
    ranking: { test: 1, odi: 2, t20: 2 },
    points: { test: 124, odi: 116, t20: 258 },
    overview: 'Australia is the most successful cricket team in history, having won six World Cups and the inaugural World Test Championship.',
    primaryColor: '#FFCD00',
    trophies: [
      { tournament: 'ICC Cricket World Cup', year: 1987 },
      { tournament: 'ICC Cricket World Cup', year: 1999 },
      { tournament: 'ICC Cricket World Cup', year: 2003 },
      { tournament: 'ICC Cricket World Cup', year: 2007 },
      { tournament: 'ICC Cricket World Cup', year: 2015 },
      { tournament: 'ICC Cricket World Cup', year: 2023 }
    ]
  },
  {
    name: 'England',
    code: 'ENG',
    logoUrl: 'https://images.unsplash.com/photo-1512719355420-e05eaff802d9?auto=format&fit=crop&w=120&q=80',
    captain: 'Jos Buttler',
    coach: 'Brendon McCullum',
    ranking: { test: 3, odi: 6, t20: 3 },
    points: { test: 108, odi: 95, t20: 252 },
    overview: 'England cricket team revolutionized modern test and white-ball play through their Bazball aggressive ideology.',
    primaryColor: '#CE1124',
    trophies: [
      { tournament: 'ICC Cricket World Cup', year: 2019 },
      { tournament: 'ICC T20 World Cup', year: 2010 },
      { tournament: 'ICC T20 World Cup', year: 2022 }
    ]
  },
  {
    name: 'South Africa',
    code: 'SA',
    logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&q=80',
    captain: 'Temba Bavuma',
    coach: 'Rob Walter',
    ranking: { test: 4, odi: 3, t20: 5 },
    points: { test: 104, odi: 110, t20: 244 },
    overview: 'The Proteas are renowned for producing world-class fast bowlers and athletic fielding units.',
    primaryColor: '#007A3D',
    trophies: [
      { tournament: 'ICC Champions Trophy', year: 1998 }
    ]
  },
  {
    name: 'New Zealand',
    code: 'NZ',
    logoUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=120&q=80',
    captain: 'Mitchell Santner',
    coach: 'Gary Stead',
    ranking: { test: 5, odi: 5, t20: 4 },
    points: { test: 98, odi: 101, t20: 247 },
    overview: 'Known as the Black Caps, New Zealand is universally respected for punch-above-their-weight tournament consistency.',
    primaryColor: '#000000',
    trophies: [
      { tournament: 'ICC World Test Championship', year: 2021 },
      { tournament: 'ICC KnockOut Trophy', year: 2000 }
    ]
  }
];

const newsData = [
  {
    title: 'Border-Gavaskar Trophy: India Prepares Aggressive Tactics Ahead of Sydney Test',
    summary: 'Captain Rohit Sharma and head coach Gautam Gambhir inspect the green pitch at the SCG as India looks to seal the marquee bilateral series.',
    content: `The Border-Gavaskar Trophy reaches a boiling fever pitch as both India and Australia lock horns in the high-stakes encounter. 

Team management emphasized fielding intensity and strike bowler rotation in the afternoon press conference. Jasprit Bumrah bowled sharp spells in the nets, consistently clocking over 142 km/h and testing top-order defences.

"We respect Australia in their home conditions, but our dressing room belief is unshakable," remarked the skipper. With crucial World Test Championship points on the line, both squads are expected to field their strongest possible XI.`,
    category: 'Match Report',
    author: 'Harsha Bhogle (Guest Column)',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
    tags: ['IND vs AUS', 'BGT', 'Test Cricket', 'Rohit Sharma'],
    isFeatured: true
  },
  {
    title: 'IPL 2026 Mega Auction: Top All-Rounders Demand Record Bids Across Franchises',
    summary: 'Franchises loosen purse strings with intense bidding wars expected for pace-bowling all-rounders and explosive top-order pinch hitters.',
    content: `With dynamic powerplay fielding restrictions and the impact player rule evolving, franchises are recalibrating their auction strategies.

Analysts anticipate bidding records could be shattered as dynamic modern all-rounders capable of bowling four overs at 140kph while striking at 170+ take center stage. Several young prodigies from domestic T20 leagues have also landed on scout radars after scintillating performances.`,
    category: 'IPL / League',
    author: 'Cricbuzz Staff',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1531415074868-83633dd5e457?auto=format&fit=crop&w=1200&q=80',
    tags: ['IPL', 'Auction', 'T20', 'Franchise Cricket'],
    isFeatured: true
  },
  {
    title: 'The Art of Swing Bowling in Modern Era: James Anderson Shares Masterclass',
    summary: 'Legendary paceman reflects on seam orientation, wrist positioning, and adapting to drop-in pitches across varying global climates.',
    content: `Even as modern bats grow heavier and boundaries are drawn tighter, seam movement and late swing remain cricket’s greatest equalizers.

In an exclusive sit-down interview, veteran master of seam shares how subtle finger pressure shifts on the leather surface create deceptive late inward dip. He advocates patience for aspiring pace prodigies: "Control your line and length before chasing raw speed."`,
    category: 'Editorial',
    author: 'Michael Atherton',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1512719355420-e05eaff802d9?auto=format&fit=crop&w=1200&q=80',
    tags: ['Bowling', 'Masterclass', 'Tactics', 'England'],
    isFeatured: false
  },
  {
    title: 'ICC Confirms Expanded Format for Next T20 World Cup With 24 Teams',
    summary: 'Cricket global expansion gathers momentum as associate nations receive guaranteed pathways to the premier international tournament.',
    content: `The International Cricket Council has ratified the blueprint to expand the men’s and women’s T20 World Cup fields. 

Following memorable upsets by teams like the USA, Scotland, and Uganda in recent cycles, global governing officials praised the deepening competitiveness of emerging cricket ecosystems. Regional qualifiers will commence starting next spring.`,
    category: 'International',
    author: 'Cricbuzz News Desk',
    readTime: '2 min read',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    tags: ['ICC', 'T20 World Cup', 'Global Cricket'],
    isFeatured: false
  }
];

const playersData = [
  {
    name: 'Virat Kohli',
    teamName: 'India',
    teamCode: 'IND',
    role: 'Top-order Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium',
    dateOfBirth: 'Nov 05, 1988',
    birthPlace: 'Delhi, India',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    iccRanking: { batting: 3, bowling: 0, allRounder: 0 },
    stats: {
      test: {
        batting: { matches: 115, innings: 195, runs: 8947, highestScore: '254*', average: 48.89, strikeRate: 55.6, hundreds: 29, fifties: 30 },
        bowling: { matches: 115, innings: 11, wickets: 0, bestBowling: '0/0', average: 0, economy: 2.8, strikeRate: 0, fourWickets: 0, fiveWickets: 0 }
      },
      odi: {
        batting: { matches: 295, innings: 283, runs: 13906, highestScore: '183', average: 58.18, strikeRate: 93.54, hundreds: 50, fifties: 72 },
        bowling: { matches: 295, innings: 50, wickets: 5, bestBowling: '1/15', average: 134.0, economy: 6.22, strikeRate: 129.2, fourWickets: 0, fiveWickets: 0 }
      },
      t20i: {
        batting: { matches: 125, innings: 117, runs: 4188, highestScore: '122*', average: 48.69, strikeRate: 137.04, hundreds: 1, fifties: 38 },
        bowling: { matches: 125, innings: 13, wickets: 4, bestBowling: '1/13', average: 51.0, economy: 8.16, strikeRate: 37.5, fourWickets: 0, fiveWickets: 0 }
      }
    },
    bio: 'Virat Kohli is widely regarded as one of the greatest all-format batsmen in the history of international cricket. Renowned for his supreme chase mastery and athletic fitness standards.'
  },
  {
    name: 'Jasprit Bumrah',
    teamName: 'India',
    teamCode: 'IND',
    role: 'Bowler',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast',
    dateOfBirth: 'Dec 06, 1993',
    birthPlace: 'Ahmedabad, Gujarat',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    iccRanking: { batting: 0, bowling: 1, allRounder: 0 },
    stats: {
      test: {
        batting: { matches: 38, innings: 55, runs: 280, highestScore: '35', average: 8.2, strikeRate: 64.0, hundreds: 0, fifties: 0 },
        bowling: { matches: 38, innings: 73, wickets: 173, bestBowling: '6/27', average: 20.49, economy: 2.76, strikeRate: 44.5, fourWickets: 8, fiveWickets: 10 }
      },
      odi: {
        batting: { matches: 89, innings: 38, runs: 85, highestScore: '16', average: 5.3, strikeRate: 58.0, hundreds: 0, fifties: 0 },
        bowling: { matches: 89, innings: 88, wickets: 149, bestBowling: '6/19', average: 23.55, economy: 4.59, strikeRate: 30.7, fourWickets: 6, fiveWickets: 2 }
      },
      t20i: {
        batting: { matches: 70, innings: 8, runs: 12, highestScore: '7', average: 4.0, strikeRate: 63.0, hundreds: 0, fifties: 0 },
        bowling: { matches: 70, innings: 69, wickets: 89, bestBowling: '3/7', average: 17.74, economy: 6.27, strikeRate: 16.9, fourWickets: 0, fiveWickets: 0 }
      }
    },
    bio: 'Jasprit Bumrah is a generational fast bowler with a hyper-unique orthodox release point, lethal yorkers, and unmatched consistency across clutch death overs.'
  },
  {
    name: 'Pat Cummins',
    teamName: 'Australia',
    teamCode: 'AUS',
    role: 'Bowler',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast',
    dateOfBirth: 'May 08, 1993',
    birthPlace: 'Westmead, Sydney',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    iccRanking: { batting: 0, bowling: 2, allRounder: 4 },
    stats: {
      test: {
        batting: { matches: 62, innings: 98, runs: 1295, highestScore: '64*', average: 16.6, strikeRate: 46.8, hundreds: 0, fifties: 3 },
        bowling: { matches: 62, innings: 116, wickets: 269, bestBowling: '6/23', average: 22.53, economy: 2.78, strikeRate: 48.6, fourWickets: 14, fiveWickets: 12 }
      },
      odi: {
        batting: { matches: 88, innings: 56, runs: 450, highestScore: '36', average: 13.2, strikeRate: 75.6, hundreds: 0, fifties: 0 },
        bowling: { matches: 88, innings: 87, wickets: 141, bestBowling: '5/70', average: 28.09, economy: 5.25, strikeRate: 32.1, fourWickets: 6, fiveWickets: 1 }
      },
      t20i: {
        batting: { matches: 52, innings: 24, runs: 160, highestScore: '28', average: 12.3, strikeRate: 130.0, hundreds: 0, fifties: 0 },
        bowling: { matches: 52, innings: 52, wickets: 66, bestBowling: '3/15', average: 23.4, economy: 7.42, strikeRate: 18.9, fourWickets: 0, fiveWickets: 0 }
      }
    },
    bio: 'Pat Cummins is Australia’s World Test Championship and World Cup winning captain, famous for relentless accuracy and inspirational leadership.'
  }
];

export const seedDatabase = async () => {
  try {
    const maskedUri = mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    console.log(`[Seed] Connecting to: ${maskedUri}`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 8000 });
    console.log(`[Seed] Connected successfully to host: ${mongoose.connection.host}`);

    console.log('[Seed] Cleaning old records...');
    await User.deleteMany();
    await News.deleteMany();
    await Team.deleteMany();
    await Player.deleteMany();

    // 1. Seed Admin User
    const adminUser = await User.create({
      name: 'Cric Admin',
      email: 'admin@cricbuzz.com',
      password: 'admin123', // Will be hashed by pre-save hook
      role: 'admin',
    });
    console.log(`[Seed] Admin created: ${adminUser.email} / admin123`);

    // 2. Seed Teams
    const createdTeams = await Team.insertMany(teamsData);
    console.log(`[Seed] ${createdTeams.length} Teams seeded.`);

    const teamMap = {};
    createdTeams.forEach((t) => {
      teamMap[t.code] = t._id;
    });

    // 3. Seed News
    const newsWithSlugs = newsData.map((item, idx) => ({
      ...item,
      slug: item.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 80) + `-${idx + 1}`
    }));
    const createdNews = await News.insertMany(newsWithSlugs);
    console.log(`[Seed] ${createdNews.length} News articles seeded.`);

    // 4. Seed Players linked to teams
    const playersWithTeamId = playersData.map((p) => ({
      ...p,
      teamId: teamMap[p.teamCode] || null,
    }));
    const createdPlayers = await Player.insertMany(playersWithTeamId);
    console.log(`[Seed] ${createdPlayers.length} Players seeded.`);

    console.log('--- Database Seeding Complete! ---');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

// Run if called directly
if (process.argv[1]?.includes('seedData.js')) {
  seedDatabase();
}
