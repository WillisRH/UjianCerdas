const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs'); // Set EJS as the template engine

// Define routes and logic herec
// Middleware for logging user actions
app.use((req, res, next) => {
  const { method, url } = req;
  // console.log(`User ${method} request to ${url}`);

  next();
});
// Route for the exam page
app.get('/exam', (req, res) => {
  res.render('home'); // Render the exam page using EJS template
});

app.get('/', (req, res) => {
  res.render('index'); // Render the exam page using EJS template
});

app.get('/done', (req, res) => {
  res.send('done gak bang? done.'); // Render the exam page using EJS template
});

// Route for receiving user actions (POST request)
app.post('/log', (req, res) => {
  const { action, details } = req.body;

  // Perform cheating detection logic here
  if (action === 'Submit Answers' && details.timeSpent < 5) {
    // Log and handle the detected cheating behavior
    console.log('Possible cheating detected: Very little time spent on a question');
    // You can take further action, such as flagging the response
  }

  // Log the action
  console.log(`User action: ${action}`, details);
  res.sendStatus(200); // Respond with a status code (e.g., 200 OK)
});

// Serve static files (e.g., stylesheets, JavaScript)
app.use(express.static('public'));
// Start the server
const port = 15000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
