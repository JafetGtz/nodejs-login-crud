const { route } = require('./user');

const router = require('express').Router();

const Note = require('../models/Notes');
const { findByIdAndUpdate } = require('../models/Notes');
const { isAuthenticated  } = require('../helper/auth');



router.get('/notes/add', isAuthenticated, (req, res) => {
   res.render('notes/new-notes');
});

router.post('/notes/new-notes', isAuthenticated,  async (req, res) => {
    const { title, description } = req.body;
    const  errors = [];

    if(!title) {
       errors.push({ text: "Please write a titile" });
    }
    if(!description){
       errors.push({ text: "Please Write a description" });
    }
    if (errors.length >0 ) {
        res.render('notes/new-notes', {
           errors,
           title,
           description
        })
    }else {
        const newNote = new Note({ title, description});
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'Note added successfully');
        res.redirect('/notes')
    }
})


router.get('/notes', isAuthenticated, async (req, res) => {
    const note =  await Note.find({user:req.user.id}).sort({date: 'desc' });
    res.render('notes/all-notes',{  note  });
});


router.get('/notes/edit/:id', isAuthenticated,async  (req, res) => {
     const note = await Note.findById(req.params.id);
    res.render('notes/edit-note', { note})
})

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    const result = await Note.findByIdAndUpdate(req.params.id, { title, description });
    req.flash('success_msg', 'Note Update Successfully');
    res.redirect('/notes')
})

router.delete('/notes/delete/:id',isAuthenticated,  async (req, res) => {
    const result = await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note Deleted Successfully');
    res.redirect('/notes');
    
});

module.exports = router;