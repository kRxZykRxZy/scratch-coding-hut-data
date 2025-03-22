const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const port = 3000;

// Path to the JSON file that will store user data
const dataPath = './users.json';

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Ensure the file exists at startup
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify({}));
}

// Handle GET request to fetch user data by username
app.get("/:username", (req, res) => {
  const username = req.params.username.toLowerCase();

  // Read user data from the file
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });

    const users = JSON.parse(data);
    if (!users[username]) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send user data
    res.status(200).json(users[username]);
  });
});

// Handle POST request to create a new user
app.post("/:username", (req, res) => {
  const username = req.params.username.toLowerCase();
  const userData = req.body;

  // Read user data from the file
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });

    const users = JSON.parse(data);
    if (users[username]) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Add the new user
    users[username] = userData;

    // Save updated user data to the file
    fs.writeFile(dataPath, JSON.stringify(users, null, 2), (writeErr) => {
      if (writeErr) return res.status(500).json({ error: "Error saving user data" });
      res.status(201).json(users[username]);
    });
  });
});

// Handle PUT request to update user data
app.put("/:username", (req, res) => {
  const username = req.params.username.toLowerCase();
  const updatedData = req.body;

  // Read user data from the file
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });

    const users = JSON.parse(data);
    if (!users[username]) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user data
    users[username] = { ...users[username], ...updatedData };

    // Save updated user data to the file
    fs.writeFile(dataPath, JSON.stringify(users, null, 2), (writeErr) => {
      if (writeErr) return res.status(500).json({ error: "Error saving user data" });
      res.status(200).json(users[username]);
    });
  });
});

// Server setup
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
