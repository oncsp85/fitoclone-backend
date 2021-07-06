const app = require('express')();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

const workoutModel = require('./schemas/workoutSchema');

// To be able to access incoming JSON in req.body
app.use(bodyParser.json());

// Middleware to allow the front-end to connect without CORS warnings
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "content-type");
  res.header("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE");
  next();
});


// CONNECT TO DB
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


// READ WORKOUTS ROUTE
app.get('/workouts', (req, res) => {
  let { day, month, year } = req.query;
  let query;

  // If day has been specified, return all workouts for that day
  if (day) {
    day = day.padStart(2, "0");
    month = month.padStart(2, "0");
    query = { date: new Date(`${year}-${month}-${day}`) };
  } 
  // If month has been specified, return all workouts for that month
  else if (month) {
    // Need to know what date the following month is
    month = month.padStart(2, "0");
    const thisMonth = new Date(`${year}-${month}-01`);
    const nextMonth = new Date(thisMonth); // copy of thisMonth
    nextMonth.setMonth(nextMonth.getMonth() + 1); // advance by 1 month

    query = { 
      "date": 
        { 
          "$gte": thisMonth, 
          "$lt": nextMonth
        }
    };
  } 
  // If year has been specified, return all workouts for that year
  else if (year) {
    const thisYear = new Date(`${year}-01-01`);
    const nextYear = new Date(thisYear);
    nextYear.setFullYear(nextYear.getFullYear + 1);
    query = { 
      "date": 
        { 
          "$gte": thisYear, 
          "$lt": nextYear
        }
    };
  }

  // Else return all workouts
  else {
    query = {};
  }
    
  workoutModel.find(query, null, { sort: {date: -1} })
    .then(workouts => {
      res.json(workouts);
  })
  .catch(err => {
    console.log("Unable to read from DB")
    console.log(err);
  });
});


// CREATE WORKOUT ROUTE
app.post('/workouts', (req, res) => {
  workoutModel.create(req.body)
    .then(() => res.json("New workout created!"))
    .catch(err => {
      console.log("Unable to add workout to database");
      console.log(err);
    });
});


// UPDATE WORKOUT ROUTE
app.put('/workouts/:id', (req, res) => {
  workoutModel.updateOne({ _id: req.params.id }, req.body)
    .then(() => res.json(`Workout ${req.body._id} updated!`))
    .catch(err => {
      console.log(`Unable to update workout ${req.body._id}`);
      console.log(err);
    });
});


// DELETE WORKOUT ROUTE
app.delete('/workouts/:id', (req, res) => {
  workoutModel.deleteOne({ _id: req.params.id })
    .then(() => res.json(`Workout ${req.params.id} deleted!`))
    .catch(err => {
      console.log(`Unable to delete workout ${req.params.id}`);
      console.log(err);
  });
});


const port = 3001;
app.listen(port, () => console.log(`App is listening on port ${port}`));