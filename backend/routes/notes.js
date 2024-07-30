const express = require("express");
const fetchuser = require("../middleware/fetchUser");
const { body, validationResult } = require("express-validator");
const Note = require("../models/Notes");

const router = express.Router();
//Route-1 Get get all the notes :Get "/api/notes/fetchallnote" . Login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});
//Route-2 Add a new notes using:post "/api/notes/addnote . Login required

router.post(
    "/addnote",
    fetchuser,
    [
        body("title", "Enter a valid title").isLength({ min: 3 }),
        body("description", "Description must be 5 characters").isLength({
            min: 5,
        }),
    ],
    async (req, res) => {
        try {
            const { title, description, tag } = req.body;
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return res.status(400).json({ errors: error.array() });
            }
            const notes = new Note({
                title,
                description,
                tag,
                user: req.user.id,
            });
            const savedNote = await notes.save();
            res.json(savedNote);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    }
);
//Route-3 Update an existing notes using:PUT "/api/notes/updatenote . Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //create a newNote object
        const newNote = {};
        if (title) { newNote.title = title; }
        if (description) { newNote.description = description; }
        if (tag) { newNote.tag = tag; }

        // find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) {            return res.status(404).send("Not Found");        }
        
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

//Route-4 Delete an existing notes using:DELETE "/api/notes/deletenote . Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    try {
        // find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) {
            res.status(404).send("Not Found");
        }

        // allwo deletion only user owns  this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ success: "Note hase been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});
module.exports = router;
