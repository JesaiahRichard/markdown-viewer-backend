const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect('mongodb+srv://jesaiahrichard:hello12345@cluster0.ucpc5uu.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

const markdownSchema = new mongoose.Schema({
  content: String,
});

const Markdown = mongoose.model('Markdown', markdownSchema);

app.use(bodyParser.json());
app.use(cors());
app.get('/', (req, res) => {
  res.send('Hello, this is the Markdown Viewer API!');
});


app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.json({ success: false, message: 'Username already exists' });
    } else {
      const newUser = new User({ username, password });
      await newUser.save();
      res.json({ success: true, message: 'User created successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/markdown', async (req, res) => {
  try {
    const markdownContent = await Markdown.find();
    res.json(markdownContent);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/markdown', async (req, res) => {
  const { content } = req.body;

  try {
    const newMarkdown = new Markdown({ content });
    await newMarkdown.save();
    res.status(201).json(newMarkdown);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/markdown/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMarkdown = await Markdown.findByIdAndRemove(id);

    if (!deletedMarkdown) {
      return res.status(404).json({ error: 'Markdown content not found' });
    }

    res.json(deletedMarkdown);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/markdown', async (req, res) => {
  try {
    await Markdown.deleteMany({});
    res.json({ message: 'All Markdown content deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/markdown/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const updatedMarkdown = await Markdown.findByIdAndUpdate(id, { content }, { new: true });

    if (!updatedMarkdown) {
      return res.status(404).json({ error: 'Markdown content not found' });
    }

    res.json(updatedMarkdown);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
