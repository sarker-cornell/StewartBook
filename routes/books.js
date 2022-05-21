const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')

const multer = require('multer')
const path = require('path')
const fs = require('fs')
const uploadPath = path.join('public', Book.coverImageBasePath)

const imageMimeTypes = ['image/jpeg','image/png','image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

//All Books Route
router.get('/', async (req,res)=>{
    //res.send('All books')
    let query = Book.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const books = await query.exec()
        res.render('books/index', {
            books:books,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }


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
    const fileName = req.file != null ? req.file.filename:null
    const book = new Book({
        title: req.body.title,
        author:req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description,
        coverImageName: fileName
    })
    //console.log(req)
    console.log()
    try {
        const newBook = await book.save()
        console.log("Book saved")
        res.redirect(`books`)
    } catch {
        if (book.coverImageName !=null) {
            removeBookCover(book.coverImageName)
        }
        console.log("Book Not saved")
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

