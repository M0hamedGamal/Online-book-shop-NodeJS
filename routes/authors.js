const express = require('express')
const Author = require('../models/author')
const Book = require('../models/book')

const router = express.Router()

// Get All Authors Route
router.get('/authors', async (req, res) => { // '/' For root page [(authors) hint: check authorRouter const into the server.js].
    const searchOptions = {}

    // Check if there's name into query of searching from user.
    if (req.query.name) {
        searchOptions.name = new RegExp(req.query.name, 'i') // 'i' --> insenstive chars .. Means JO = jo
    }

    try {
        const authors = await Author.find(searchOptions) // If searchOptions is empty that's mean get all authors
        res.render('authors/index', {
            authors: authors,
            searchOptions: req.query
        })

    } catch (error) {

        res.redirect('/authors')
    }
})

// Get New Author Route
router.get('/authors/new', (req, res) => { // '/new' For new page.
    res.render('authors/new', { author: new Author() })  // {author : new Author()} --> send data to work with it as a key & value.
})


// Create New Author Route
router.post('/authors', async (req, res) => { // '/' For root page [(authors) hint: check authorRouter const into the server.js].
    const author = new Author({
        name: req.body.name
    })

    try {
        const newAuthor = await author.save()
        res.redirect(`/authors/${newAuthor.id}`)
    } catch (error) {
        res.render('/authors/new', {
            author: author,
            errorMsg: 'Error Creating author'
        })
    }

    res.send(req.body.name) // body.name get from value of author.name into _form_fields.ejs

})

router.get('/authors/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id }).limit(6).exec()

        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch (error) {
        res.redirect('/authors')
    }
})

router.get('/authors/:id/edit', async (req, res) => {
    try {

        const author = await Author.findById(req.params.id)

        res.render('authors/edit', { author: author })

    } catch (error) {
        res.redirect('/authors')
    }

})

router.put('/authors/:id', async (req, res) => {
    let author

    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()

        res.redirect(`/authors/${author.id}`)

    } catch (error) {
        if (!author) {
            return res.redirect('/authors')
        }

        res.render('authors/edit', {
            author: author,
            errorMsg: 'Error Updating Author'
        })
    }
})

router.delete('/authors/:id', async (req, res) => {
    let author

    try {
        author = await Author.findById(req.params.id)
        await author.remove()

        res.redirect(`/authors`)

    } catch (error) {
        if (!author) {
            res.redirect('/authors')
            
        }else{

            res.redirect(`/authors/${author.id}`)
        }

    }
})

module.exports = router