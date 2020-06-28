const express = require('express')
const Book  = require('../models/book')
const Author = require('../models/author')
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

// Create New Books Route
router.post('/books/new', async (req, res) => { // '/' For root page [(books) hint: check authorRouter const into the server.js].
    const book = new Book({
        title: req.body.title,
        description: req.body.description,
        publishDate: new Date(req.body.publishDate), // req.body.publishDate is String & we need to new Date() to store Date format into database not String.
        pageCount: req.body.pageCount,
        author: req.body.author
    })

    saveCover(book, req.body.cover)

    try {
        const newBook = await book.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect('/books')

    } catch (error) {
        
        renderNewPage(res, book, true)
    }
})

function saveCover(book, coverEncoded){
        if(!coverEncoded) return
        
        const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'] // Accepting formats
        
        const cover = JSON.parse(coverEncoded) // Convert String to JSON
    
        if(cover && imageMimeTypes.includes(cover.type)){
            book.coverImage = new Buffer.from(cover.data, 'base64')
            book.coverImageType = cover.type
        }
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