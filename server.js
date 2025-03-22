const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

const dataPath = path.join(__dirname, 'users.json');

app.get('/:username', (req, res) => {
  const username = req.params.username.toLowerCase();

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Internal Server Error' });

    const users = JSON.parse(data);
    if (users[username]) {
      res.json(users[username]);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
});

app.post('/', (req, res) => {
  const newUser = req.body;

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Internal Server Error' });

    const users = JSON.parse(data);
    if (users[newUser.username.toLowerCase()]) {
      return res.status(400).json({ error: 'User already exists' });
    }

    users[newUser.username.toLowerCase()] = newUser;
    fs.writeFile(dataPath, JSON.stringify(users, null, 2), (writeErr) => {
      if (writeErr) return res.status(500).json({ error: 'Error saving user data' });
      res.status(201).json(newUser);
    });
  });
});

app.put('/:username', (req, res) => {
  const username = req.params.username.toLowerCase();
  const updatedData = req.body;

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Internal Server Error' });

    const users = JSON.parse(data);
    if (!users[username]) {
      return res.status(404).json({ error: 'User not found' });
    }

    users[username] = { ...users[username], ...updatedData };
    fs.writeFile(dataPath, JSON.stringify(users, null, 2), (writeErr) => {
      if (writeErr) return res.status(500).json({ error: 'Error saving user data' });
      res.status(200).json(users[username]);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
