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

const markdownSchema = new mongoose.Schema({
  content: String,
});

const Markdown = mongoose.model('Markdown', markdownSchema);


app.use(bodyParser.json());
app.use(cors());
app.get('/', (req, res) => {
  res.send('Hello, this is the Markdown Viewer API!');
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
