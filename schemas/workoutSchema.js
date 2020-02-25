const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    workout_id: Number,
    // ISO 8601 formatted string (I think, might have to change back to Date)
    date: {
      $date: String
    },
    exercises: [
      {
        exercise_id: Number,
        type: String,  // Exercise type, e.g. cardio/weights/bodyweight
        name: String,
        sets: [
          {
            set_id: Number,
            set_comment: String,
            pr: Boolean,

            // Weight-lifting specific properties
            weight: { value: Number, unit: String },
            reps: Number,
            rpe: Number,
            warmup: Boolean,
              
            // Cardio specific properties
            distance: { value: Number, unit: String },
            time: Number,  // storing time in seconds
            avhr: Number
          }
        ]
      }
    ],
    workout_comments: String
  }, { typeKey: "_type" } // to avoid a clash with the "type" property
);

module.exports = mongoose.model("Workout", schema);