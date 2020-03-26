const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    workout_id: Number,
    date: Date,

    // Mongoose by default automatically adds an _id field for nested objects, 
    // e.g. for exercises and sets, _id : { id: false } stops this
    exercises: [
      {
        _id: { id: false },
        exercise_id: Number,
        type: String,  // Exercise type, e.g. cardio/weights/bodyweight
        name: String,
        sets: [
          {
            _id: { id: false },
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