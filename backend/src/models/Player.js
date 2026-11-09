import mongoose from 'mongoose';

const battingStatsSchema = new mongoose.Schema(
  {
    matches: { type: Number, default: 0 },
    innings: { type: Number, default: 0 },
    runs: { type: Number, default: 0 },
    highestScore: { type: String, default: '0' },
    average: { type: Number, default: 0 },
    strikeRate: { type: Number, default: 0 },
    hundreds: { type: Number, default: 0 },
    fifties: { type: Number, default: 0 },
  },
  { _id: false }
);

const bowlingStatsSchema = new mongoose.Schema(
  {
    matches: { type: Number, default: 0 },
    innings: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    bestBowling: { type: String, default: '0/0' },
    average: { type: Number, default: 0 },
    economy: { type: Number, default: 0 },
    strikeRate: { type: Number, default: 0 },
    fourWickets: { type: Number, default: 0 },
    fiveWickets: { type: Number, default: 0 },
  },
  { _id: false }
);

const formatStatsSchema = new mongoose.Schema(
  {
    batting: { type: battingStatsSchema, default: () => ({}) },
    bowling: { type: bowlingStatsSchema, default: () => ({}) },
  },
  { _id: false }
);

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Player name is required'],
      trim: true,
    },
    teamName: {
      type: String,
      required: true,
      trim: true,
    },
    teamCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
    role: {
      type: String,
      enum: ['Top-order Batter', 'Middle-order Batter', 'Wicketkeeper Batter', 'All-rounder', 'Bowler'],
      default: 'Top-order Batter',
    },
    battingStyle: {
      type: String,
      default: 'Right-hand bat',
    },
    bowlingStyle: {
      type: String,
      default: 'Right-arm medium',
    },
    dateOfBirth: {
      type: String,
      default: '',
    },
    birthPlace: {
      type: String,
      default: '',
    },
    avatarUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    iccRanking: {
      batting: { type: Number, default: 0 },
      bowling: { type: Number, default: 0 },
      allRounder: { type: Number, default: 0 },
    },
    stats: {
      test: { type: formatStatsSchema, default: () => ({}) },
      odi: { type: formatStatsSchema, default: () => ({}) },
      t20i: { type: formatStatsSchema, default: () => ({}) },
      ipl: { type: formatStatsSchema, default: () => ({}) },
    },
    bio: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

playerSchema.index({ name: 'text', teamName: 'text', teamCode: 'text' });

export const Player = mongoose.model('Player', playerSchema);
