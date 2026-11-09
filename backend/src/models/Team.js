import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Team name is required'],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Team code is required (e.g. IND, AUS)'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    logoUrl: {
      type: String,
      default: '',
    },
    captain: {
      type: String,
      default: '',
    },
    coach: {
      type: String,
      default: '',
    },
    ranking: {
      test: { type: Number, default: 0 },
      odi: { type: Number, default: 0 },
      t20: { type: Number, default: 0 },
    },
    points: {
      test: { type: Number, default: 0 },
      odi: { type: Number, default: 0 },
      t20: { type: Number, default: 0 },
    },
    overview: {
      type: String,
      default: '',
    },
    primaryColor: {
      type: String,
      default: '#0055A5',
    },
    trophies: [
      {
        tournament: String,
        year: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

teamSchema.index({ name: 'text', code: 'text' });

export const Team = mongoose.model('Team', teamSchema);
