const express = require('express')
const router = express.Router()
const fetchuser = require('../middleware/fetchuser')
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');

//Route 1. Fetch all notes using: Get: /api/notes/fetchAllNotes. Login Reqd
router.get('/fetchAllNotes', fetchuser, async (req, res) => {
    try {
        userId = req.user.id
        const notes = await Notes.find({ user: userId })
        res.json(notes)
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error:")
    }
})

//Route 2. Add notes using: Post: /api/notes/addnote. Login Reqd
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', "Enter a description more than 5 chars").isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const note = new Notes({
            user: req.user.id, title: req.body.title, description: req.body.description, tag: req.body.tag
        })
        const savednote = await note.save()
        res.json(savednote)
    }
    catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error:")
    }
})


// Route 3. Delete note using: Delete: /api/notes/deletenote. Login Reqd
router.delete('/deletenote/:id', fetchuser, [], async (req, res) => {
    try {
        let note=await Notes.findById(req.params.id)
        if(!note){
            res.status(404).send("Note not found")
        }
        if(req.user.id!=note.user.toString()){return res.status(401).send("Not allowed")}
        note=await Notes.findByIdAndDelete(req.params.id)
        res.send({"success":"Note has been deleted",note:note})
    }
    catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error:")
    }
})

//Route 4. Update a note using: PUT: /api/notes/updatenote. Login Reqd
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const {title,description,tag}=req.body
        const newNote={}
        if(title){newNote.title=title}
        if(description){newNote.description=description}
        if(tag){newNote.tag=tag}
   

        let note=await Notes.findById(req.params.id)

        if(!note){
            res.status(404).send("Note not found")
        }

        if(req.user.id!=note.user.toString()){return res.status(401).send("Not allowed")}
        note=await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
        res.send(note)
    }
    catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error:")
    }
})

module.exports = router