const app = require('express')();
const mongoose = require('mongoose');
const workoutModel = require('./schemas/workoutSchema');

// To allow front-end to connect without CORS warnings
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  next();
});

mongoose.connect('mongodb://localhost/fitoclone', 
  { 
    useNewUrlParser: true, 
    useUnifiedTopology: true  // required to a remove a deprecation warning
  }
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to the database');
});

app.get('/', (req, res) => {
  workoutModel.find(
    { "date": 
      { 
        "$gte": new Date("2020-02-01"), 
        "$lte": new Date()
      }
    }, 
    null, 
    { sort: {date: -1} }
  )
  .then(workouts => {
    res.json(workouts);
  })
  .catch(err => {
    console.log("Unable to read from DB")
    console.log(err);
  });
});

const port = 3001;
app.listen(port, () => console.log(`App is listening on port ${port}`));