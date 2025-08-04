
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let items = [];

// CREATE
app.post('/items', (req, res) => {
  const item = req.body;
  item.id = Date.now();
  items.push(item);
  res.status(201).json(item);
});

// READ ALL
app.get('/items', (req, res) => {
  res.json(items);
});

// READ ONE
app.get('/items/:id', (req, res) => {
  const item = items.find(i => i.id == req.params.id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// UPDATE
app.put('/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id == req.params.id);
  if (index !== -1) {
    items[index] = { ...items[index], ...req.body };
    res.json(items[index]);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// DELETE
app.delete('/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id == req.params.id);
  if (index !== -1) {
    const deleted = items.splice(index, 1);
    res.json(deleted[0]);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
