const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  bodyweight: { weight: Number, unit: String },
  prs: [
    {
      name: String,
      weight: { value: Number, unit: String },
      reps: Number,
      distance: { length: Number, unit: String },
      time: Date
    }
  ],
  workouts: [ mongoose.Schema.ObjectId ]
});

module.exports = mongoose.model("User", schema);