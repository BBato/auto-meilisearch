const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: false,
      trim: true,
      minlength: 3,
    },
    jobs: {
      type: Array,
    },
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    company: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// export default mongoose.models.User || mongoose.model('User', UserSchema);
