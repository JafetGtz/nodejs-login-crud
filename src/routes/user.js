const router = require('express').Router();
const User  = require('../models/User');
const passport = require('passport');


router.get('/signIn', (req, res) => {
    res.render('users/signIn');
});

router.post('/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/signIn',
    failureFlash: true

}) )

router.get('/signup', (req, res) => {
    res.render('users/signUp');
});

router.post('/users/signup', async (req, res) => {
    const {name, email, password, password_confirm } = req.body;
    const errors = [];
    if(name.length <= 0){
        errors.push({ text: 'Please insert you name' })
    }
    if(password != password_confirm)
        errors.push({  text: 'password do not match' });
    if(password.lenggth > 4) 
        errors.push({text: 'Password must be at least'});
    if(errors.length > 0)
    res.render('users/signUp', {errors, name, email, password, password_confirm })
    else{
        const emailUser = await User.findOne({email: email});
        if (emailUser) {
            req.flash('error_msg', 'The email is already');
            res.redirect('/signup');
        }
        const newUser  = User({ name, email, passport  });
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        res.redirect('/signIn');
    }
     
      
      
})


router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/')
});

module.exports = router;