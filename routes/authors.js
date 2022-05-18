const express = require('express')
const router = express.Router()
const Author = require('../models/author')


//All authors Route
router.get('/', async (req,res)=>{
    try {
        const authors = await Author.find({})
        res.render('authors/index', {authors: authors})
    } catch {
        res.redirect('/')

    }
    //res.render('authors/index')
})


// New author route
router.get('/new', (req,res) =>{
    res.render('authors/new', {author: new Author()})
})

// Create Author Route
router.post('/', async (req,res) =>{
    //res.send('Create author')
    const author = new Author({
        name: req.body.name
    })

    try {
        const newAuthor = await author.save()
        res.redirect(`authors`)
        console.log("auth okay")
        
    } catch {
        res.render('authors/new',{
            author: author,
            errorMessage: 'Bug in my code'
            
        })
        console.log("BBB")
    }


})


module.exports = router

