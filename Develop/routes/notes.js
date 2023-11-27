const notes = require('express').Router();
// require uuid package instead of making my own helper
const { uuid } = require('uuidv4');
const { readFromFile, writeToFile, readAndAppend, } = require('../helpers/fsUtils');

// GET all notes
notes.get('/', (req, res) => {
  readFromFile('./db/db.json')
    .then((data) => res.json(JSON.parse(data)));
});

// POST a new note
notes.post('/', (req, res) => {
  const { title, text } = req.body;
  if (req.body) {
    const newNote = {
      title, text, id: uuid(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json({ message: 'Note added successfully' })
  } else {
    res.error('Error adding note');
  }
});

notes.delete('/:id', (req, res) => {
  
})