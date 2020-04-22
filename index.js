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
  res.header("Access-Control-Allow-Methods", "POST, PUT, GET");
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
  month = month.padStart(2, "0");
  let query;

  // If day hasn't been specified, return all workouts for the month
  if (!day) {
    const nextMonth = 
      month === "12" ? "01" : String(Number(month) + 1).padStart(2, "0");
    const nextYear = nextMonth === "01" ? String(Number(year) + 1) : String(year);

    query = { 
      "date": 
        { 
          "$gte": new Date(`${year}-${month}-01`), 
          "$lt": new Date(`${nextYear}-${nextMonth}-01`)
        }
    };
  } 
  // If day has been specified, return all workouts for that day
  else {
    day = day.padStart(2, "0");
    query = { date: new Date(`${year}-${month}-${day}`) };
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
  workoutModel.updateOne({ _id: req.body._id }, req.body)
    .then(() => res.json(`Workout ${req.body._id} updated!`))
    .catch(err => {
      console.log(`Unable to update workout ${req.body._id}`);
      console.log(err);
    });
});


const port = 3001;
app.listen(port, () => console.log(`App is listening on port ${port}`));