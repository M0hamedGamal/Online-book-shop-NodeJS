const express = require('express')
const Author = require('../models/author')

const router = express.Router()

// Get All Authors Route
router.get('/', async (req, res) => { // '/' For root page [(authors) hint: check authorRouter const into the server.js].
    const searchOptions = {}

    // Check if there's name into query of searching from user.
    if (req.query.name) {
        searchOptions.name = new RegExp(req.query.name, 'i') // 'i' --> insenstive chars .. Means JO = jo
    }

    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', {
            authors: authors,
            searchOptions: req.query
        })
        
    } catch (error) {

        res.redirect('/')
    }

})

// Get New Author Route
router.get('/new', (req, res) => { // '/new' For new page.
    res.render('authors/new', { author: new Author() })  // {author : new Author()} --> send data to work with it as a key & value.

})

// Create New Author Route
router.post('/', async (req, res) => { // '/' For root page [(authors) hint: check authorRouter const into the server.js].
    const author = new Author({
        name: req.body.name
    })

    try {
        const newAuthor = await author.save()
        // res.redirect(`authors/${newAuthor.id}`)
        res.redirect('authors')

    } catch (error) {
        res.render('authors/new', {
            author: author,
            errorMsg: 'Error Creating author'
        })
    }

    res.send(req.body.name) // body.name get from value of author.name into _form_fields.ejs

})

module.exports = router