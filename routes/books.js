const express = require('express')
const path = require('path')
const Book  = require('../models/book')
const Author = require('../models/author')
const multer = require('multer')    // Upload files
const fs = require('fs')
const book = require('../models/book')

const router = express.Router()

// Get All Books Route
router.get('/books', async (req, res) => { // '/' For root page [(Books) hint: check bookRouter const into the server.js].

    let query = Book.find() // it's empty find to use it below

    if (req.query.title) {
        // Get all books where title = req.query.title
        query = query.regex('title', new RegExp(req.query.title, 'i')) // Find title with insenstive chars 
    }
    if (req.query.publishedAfter) {
                // Get all books where publishDate is greater than req.query.publishedAfter
        query = query.gte('publishDate', req.query.publishedAfter) // gte --> Greater that or Equal
    }
    if (req.query.publishedBefore) {
        // Get all books where publishDate is less than req.query.publishedBefore
        query = query.lte('publishDate', req.query.publishedBefore) // lte --> Less that or Equal
    }

    try {
        const books = await query.exec()    //execute query after filtering.

        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch{
        res.redirect('/books')
    }
})

// Get New Book Route
router.get('/books/new', async (req, res) => { // '/new' For new page.

    renderNewPage(res, new Book())

})

imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'] // Accepting formats
const uploadPath = path.join('public', 'uploads/bookCovers') // Path of storing images into folder

const upload = multer({
    dest: uploadPath,   // destination: folder that storing images
    fileFilter: (req, file, callback) => {  // filter for format of images
        callback(null, imageMimeTypes.includes(file.mimetype)) // includes --> return true or false | file.mimetype --> internal mimeType for image format [From google support]
    }
})

// Create New Books Route
router.post('/books/new', upload.single('cover'), async (req, res) => { // '/' For root page [(books) hint: check authorRouter const into the server.js].
    const ImageFileName = req.file !== null ? req.file.filename : null // req.file --> Created from multer lib to allow us access the image

    const book = new Book({
        title: req.body.title,
        description: req.body.description,
        publishDate: new Date(req.body.publishDate), // req.body.publishDate is String & we need to new Date() to store Date format into database not String.
        pageCount: req.body.pageCount,
        coverImageName: ImageFileName,
        author: req.body.author
    })

    try {
        const newBook = await book.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect('/books')

    } catch (error) {
        removeCoverImage(book.coverImageName)
        renderNewPage(res, book, true)
    }
})

function removeCoverImage(imageName) {
    const coverPath = path.join(uploadPath, imageName)  // Path of image
    fs.unlink(coverPath, err => {   // unlink --> delete file by path
        if (err)
            console.log(err)
    })
}

// Create renderNewPage to use it into get & post methods to avoid duplicate 
async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) params.errorMsg = 'Error Creating Book'
        res.render('books/new', params)
    } catch (error) {
        res.redirect('/books')
    }
}

module.exports = router