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

// DELETE an old note
notes.delete('/:id', (req, res) => {
  const noteId = req.params.note_id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      if (!noteId) {
        return res.status(404).json('Note does not exist');
      }
      // Make a new array of all notes except the one with the ID provided in the URL
      const result = json.filter((note) => note.note_id !== noteId);
      // Save that array to the filesystem
      writeToFile('./db/db.json', result);
      // Respond to the DELETE request
      res.json(`Item ${noteId} has been deleted 🗑️`);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = notes;