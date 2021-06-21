const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    company: { type: String },

    title: {
      type: String,
      unique: false,
      trim: true,
      required: true,
    },

    category: {
      type: String,
      unique: false,
      trim: false,
      required: true,
    },

    description: {
      type: String,
      unique: false,
      trim: true,
      required: true,
    },

    location: {
      type: String,
      unique: false,
      trim: false,
      required: true,
    },

    isRemote: {
      type: Boolean,
      unique: false,
      trim: false,
      required: true,
    },

    tags: {
      type: Array,
      unique: false,
      trim: false,
      required: true,
    },

    application: {
      type: String,
      unique: false,
      trim: false,
      required: true,
    },

    salaryLower: {
      type: Number,
      unique: false,
      trim: false,
      required: true,
    },

    salaryUpper: {
      type: Number,
      unique: false,
      trim: false,
      required: true,
    },

    equity: {
      type: Number,
      unique: false,
      trim: false,
      required: true,
    },

    stripeConfirmed: {
      type: Boolean,
      unique: false,
      trim: false,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

try {
  mongoose.model('Job');
} catch (error) {
  mongoose.model('Job', JobSchema);
}

export default mongoose.model.Job;
