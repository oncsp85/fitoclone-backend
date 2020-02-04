const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    date: Date,
    exercises: [
      {
        type: String,
        name: String,
        sets: [
          {
            // Useful for ordering, will be needed when importing from Fitocracy
            id: Number,

            // Weight-lifting specific properties
            weight: { value: Number, unit: String },
            reps: Number,
            rpe: Number,
            warmup: Boolean,
            
            // Cardio specific properties
            distance: { length: Number, unit: String },
            time: Date,
            avhr: Number
          }
        ]
      }
    ],
    comments: [ 
      { 
        comment: String, 
        userid: mongoose.Schema.ObjectId, 
        date: Date 
      } 
    ]
  }, { typeKey: "_type" } // to avoid a clash with the "type" property
);

module.exports = mongoose.model("Workout", schema);