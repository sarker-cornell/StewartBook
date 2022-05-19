const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')

//All Books Route
router.get('/', async (req,res)=>{
    res.send('All books')

})


// New Book route
router.get('/new', async (req,res) =>{
    //res.send('New books')
    try {
        const authors = await Author.find({})
        const book = new Book()
        res.render('books/new', {
            authors:authors,
            book: book
        })
    } catch {
        res.redirect('books')
    }
})

// Create Book Route
router.post('/', async (req,res) =>{
    res.send('Create books')
})


module.exports = router

