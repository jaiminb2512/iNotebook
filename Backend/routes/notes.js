const express = require('express');
const fetchUser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');
const router = express.Router();
 
// ROUTE 1 : Get all the notes using: GET "/api/notes/fetchallNote". Login required
router.get('/fetchallnote', fetchUser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occurred");
    }
});

// ROUTE 2 : Add a new Note using: POST "/api/notes/addNote". Login required
router.post('/addnote', fetchUser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be at least 5 characters').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        // If there are validation errors, return Bad Request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Create a new note with the user ID
        const note = new Note({
            title,
            description,
            tag,
            user: req.user.id
        });

        // Save the note to the database
        const savedNote = await note.save();

        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occurred");
    }
});

// ROUTE 3 : Update an existing note Note using: PUT "/api/notes/updatenote". Login required
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    try {
        
        const { title, description, tag } = req.body
        // Create a newNote object
        const newNote = {}
        if(title){newNote.title = title}
        if(description){newNote.description = description}
        if(tag){newNote.tag = tag}

        // Find the note to be upadated and update it
        let note = await Note.findById(req.params.id)
        if(!note){return res.status(404).send("Not Found")}

        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Note Allowed")
        } 

        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
        res.json({note})


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occurred");
    }
});

// ROUTE 4 : Delete an existing note using: DELETE "/api/notes/deletenote/:id". Login required
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
        // Find the note to be deleted
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Note not found");
        }

        // Check if the user owns the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not authorized to delete this note");
        }

        // Delete the note
        await note.deleteOne();

        res.json({ Sucess: "Note has been deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occurred");
    }
});


module.exports = router