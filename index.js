const express = require("express");
const bodyParser = require("body-parser");
const Cookies = require("cookies");
const cors = require('cors'); 
const axios = require('axios'); 

const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.set("view engine", "ejs"); // Set EJS as the template engine

// Define routes and logic herec
// Middleware for logging user actions
app.use((req, res, next) => {
  const { method, url } = req;
  // console.log(`User ${method} request to ${url}`);
  const cookies = new Cookies(req, res);
  const username = cookies.get("username");
  const password = cookies.get("password");
  const kodesoal = cookies.get("kodesoal");

  console.log(username + " " + kodesoal)
  next();
});



// Route for the exam page
app.get("/exam/:id/:id", async (req, res) => {
  const cookies = new Cookies(req, res);
  const username = cookies.get("username");
  const id = cookies.get("id");
  const kodesoal = cookies.get("kodesoal");

try {

  const response = await fetch("http://localhost:51000/api/exams/fetch", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, id, kodesoal }),
		});
    const exam = await response.json();
    // const questionid = json.questionid;
    // const question = json.question;
    // const choices = json.choices;
    // const answer = json.answer;
    // const isEssay = json.isEssay;
    console.log(exam)
    res.render("home", {
      username,
      id,
      kodesoal,
      exam
    });
    

} catch(err) {
  console.log(err)

}
  

   // Render the exam page using EJS template
});

app.get("/", (req, res) => {
  res.render("index"); // Render the exam page using EJS template
});
app.get("/create", (req, res) => {
  res.render("creator"); // Render the exam page using EJS template
});


app.get("/done", (req, res) => {
  res.send("done gak bang? done."); // Render the exam page using EJS template
});

app.post('/mapelcreate', async (req, res) => {
	try {
	  // Get the mapel data from the user input
	  const { mapelname, owner } = req.body;
	  const cookies = new Cookies(req, res);
	  const id = cookies.get("id")

	  // Create an object with the user input
	  const mapelData = {
		mapelname, // Replace with your mapelid input
		owner: id, // Replace with your owner input
	  };
  
	  // Make a POST request to create the mapel
	  const response = await axios.post('http://localhost:51000/api/mapel/create', mapelData);

	  console.log(response.data)

	  // Render the "creator" page using EJS after the mapel is created
	  res.render('creator', { mapelCreated: response.data }); // You can update the EJS rendering as needed
	} catch (error) {
	  console.error('Error creating mapel via Axios:', error);
	  res.status(500).json({ error: 'Failed to create mapel' });
	}
  });

// Route for receiving user actions (POST request)
app.post("/log", (req, res) => {
  const { action, details, username, attempts } = req.body;

  const cookies = new Cookies(req, res);

  // // Perform cheating detection logic here
  // if (action === "Submit Answers" && details.timeSpent < 5) {
  //   // Log and handle the detected cheating behavior
  //   console.log(
  //     "Possible cheating detected: Very little time spent on a question"
  //   );
  //   // You can take further action, such as flagging the response
  // }

  // Log the action
  if (attempts < 5) {
  console.log(`User action: ${action}`, attempts,`(${username})`);
  } else {
    console.log(`User action: ${action}`, "(blocked)",`(${username})`);
  }
  res.sendStatus(200); // Respond with a status code (e.g., 200 OK)
});

app.get("/signup", (req, res) => {
	res.render("signuphandler.ejs", {
		title: "Sign Up",
	});
});

app.post("/home/askme/admin/signupatt", async (req, res) => {
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;

	try {
		const response = await fetch("http://localhost:51000/api/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: email,
				password: password,
				username: username,
			}),
		});
		if (response.status == "400") {
			res.render("signuphandler.ejs", {
				title: "Sign Up",
				error: "User with that username or email is already Exist!",
			});
			return; //console.log('The Username is already Exist! Please try again! (400)')
		}
		if (!response.ok) {
			throw new Error(response.statusText, "\n Error");
		}
		// console.log('Success logged in with username \'' + email + "\'\nRedirecting to admin page! (200)")
		res.redirect("/home/askme/admin/login");
	} catch (e) {
		res.render("index.ejs", {
			title: "Sign Up",
			error: "The server is currently down/under maintenance!",
		});
	}
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  console.log(username, password)


	try {
		const response = await fetch("http://localhost:51000/api/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		});
		if (response.status == "202" || response.status == "203") {
			res.render("index.ejs", {
				title: "Login Page",
				error: "Your password or email is incorrect. Please try again!",
			});
			return console.log('The username or id is invalid! Please try again! (400)')
		}
		if (!response.ok) {
			throw new Error(response.statusText, "\n Error");
		}
		const json = await response.json();
let expires = new Date();
expires.setSeconds(expires.getSeconds() + 3600);
let cookies = new Cookies(req, res);

const userData = json.user;

cookies.set("token", userData.token, { expires: expires });
cookies.set("email", userData.email, { expires: expires });
cookies.set("username", userData.username, { expires: expires });
cookies.set("type", userData.usertype, { expires: expires });
cookies.set("id", userData.id, { expires: expires });

		// console.log('Success logged in with username \'' + username + "\'\nRedirecting to admin page! (200)")
		// res.render("home", {
    //   username,
    //   password,
    //   kodesoal,
    // });
    res.redirect(`/profile`)
		console.log(json)

		// if(json.token) localStorage.setItem('token', json.token);

		// setTokenWithExpiration(50000);
	} catch (error) {
		res.render("index.ejs", {
			title: "Login Page",
			error: "The server is currently down/under maintenance!",
			hideButton: true,
		});
	}

  // const cookies = new Cookies(req, res);

  // cookies.set("username", username);
  // cookies.set("password", password);
  // cookies.set("kodesoal", kodesoal);
  // return res.redirect("/exam");
});

app.get("/logout", async (req, res) => {
	let cookies = new Cookies(req, res);
	let onesec = new Date().setTime() + 1;
	if (!cookies) {
		return res.render("loginhandler.ejs", {
			title: "Login Page",
			error: "No cookies detected!",
		});
	}

	cookies.set("email", 0, { expires: onesec });
	cookies.set("token", 0, { expires: onesec });
	cookies.set("username", 0, { expires: onesec });
	cookies.set("id", 0, { expires: onesec });
  cookies.set("kodesoal", 0, { expires: onesec });
	// console.log('Successfully deleting the cookies!')
	res.render("index.ejs", {
		title: "Login Page",
		success: "Your account has been logged out!",
	});
});

app.get("/profile", async (req, res) => {
	let cookies = new Cookies(req, res);
	const id = cookies.get("id");
	const response = await fetch("http://localhost:51000/api/getuserdata", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id }),
	});
	const data = await response.json();
	console.log(data)

	res.render("profile.ejs", {
		title: `${data.username} Profile Pages`,
		data
	});
});




// Serve static files (e.g., stylesheets, JavaScript)
app.use(express.static("public"));
// Start the server
const port = 15000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
