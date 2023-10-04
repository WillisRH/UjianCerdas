const express = require("express");
const bodyParser = require("body-parser");
const Cookies = require("cookies");
const expressLayouts = require("express-ejs-layouts");

const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressLayouts);
app.set("view engine", "ejs"); // Set EJS as the template engine
app.set("layout", "layouts/main");

// Define routes and logic herec
// Middleware for logging user actions
app.use((req, res, next) => {
  const { method, url } = req;
  // console.log(`User ${method} request to ${url}`);

  next();
});
// Route for the exam page
app.get("/exam", (req, res) => {
  const cookies = new Cookies(req, res);
  const username = cookies.get("username");
  const password = cookies.get("password");
  const kodesoal = cookies.get("kodesoal");

  res.render("home", {
    username,
    password,
    kodesoal,
  }); // Render the exam page using EJS template
});

app.get("/", (req, res) => {
  res.render("index"); // Render the exam page using EJS template
});

app.get("/done", (req, res) => {
  res.send("done gak bang? done."); // Render the exam page using EJS template
});

// Route for receiving user actions (POST request)
app.post("/log", (req, res) => {
  const { action, details } = req.body;

  const cookies = new Cookies(req, res);

  // Perform cheating detection logic here
  if (action === "Submit Answers" && details.timeSpent < 5) {
    // Log and handle the detected cheating behavior
    console.log(
      "Possible cheating detected: Very little time spent on a question"
    );
    // You can take further action, such as flagging the response
  }

  // Log the action
  console.log(`User action: ${action}`, details);
  res.sendStatus(200); // Respond with a status code (e.g., 200 OK)
});

app.post("/login", (req, res) => {
  const { username, password, kodesoal } = req.body;

  const cookies = new Cookies(req, res);

  cookies.set("username", username);
  cookies.set("password", password);
  cookies.set("kodesoal", kodesoal);
  return res.redirect("/exam");
});

// Serve static files (e.g., stylesheets, JavaScript)
app.use(express.static("public"));
// Start the server
const port = 15000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
