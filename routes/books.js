const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')

const path = require('path')
const fs = require('fs')
const uploadPath = path.join('public', Book.coverImageBasePath)
const multer = require('multer')
const imageMimeTypes = ['images/jpeg','images/png','images/gif']
const upload = multer({
    dest: uploadPath,
    // fileFilter: (req, file, callback) ={
    //     callback(null, )
    // }
})

//All Books Route
router.get('/', async (req,res)=>{
    res.send('All books')

})


// New Book route
router.get('/new', async (req,res) =>{
    //res.send('New books')
    // try {
    //     const authors = await Author.find({})
    //     const book = new Book()
    //     res.render('books/new', {
    //         authors:authors,
    //         book: book
    //     })
    // } catch {
    //     res.redirect('/books')
    // }
    renderNewPage(res, new Book())
})

// Create Book Route
router.post('/', upload.single('cover'), async (req,res) =>{
    //res.send('Create books')
    const fileName = req.file != null? req.file.filename:null
    const book = new Book({
        title: req.body.title,
        author:req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description,
        coverImageName: fileName
    })

    try {
        const newBook = await book.save()
        res.redirect('books')
    } catch {
        if (book.coverImageName !=null) {
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true)        
    }

})


async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors:authors,
            book: book
        }
        if (hasError) params.errorMessage = 'Error1 Creating This Book'
        res.render('books/new', params)
    } catch {
        res.redirect('/books')
    }
}

function removeBookCover(filename) {
    fs.unlink(path.join(uploadPath, filename), err=>{
        if (err) console.log(err)
    })
}


module.exports = router

