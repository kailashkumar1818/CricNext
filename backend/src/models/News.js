import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    summary: {
      type: String,
      required: [true, 'Article summary is required'],
      trim: true,
      maxlength: [400, 'Summary cannot exceed 400 characters'],
    },
    content: {
      type: String,
      required: [true, 'Article content is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['International', 'Match Report', 'IPL / League', 'Editorial', 'Interview', 'Features'],
      default: 'International',
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
    },
    author: {
      type: String,
      default: 'Cricbuzz Desk',
      trim: true,
    },
    readTime: {
      type: String,
      default: '3 min read',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from title before validation
newsSchema.pre('validate', function (next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    const slugBase = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 80);
    this.slug = `${slugBase}-${Date.now().toString().slice(-4)}`;
  }
  next();
});

// Text index for search functionality
newsSchema.index({ title: 'text', summary: 'text', content: 'text', tags: 'text' });

export const News = mongoose.model('News', newsSchema);
