const app = require('express')();
const mongoose = require('mongoose');

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
  res.send("Server running");
});

const port = 3001;
app.listen(port, () => console.log(`App is listening on port ${port}`));