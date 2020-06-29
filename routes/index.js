const express = require('express')
const router = express.Router()
const Book = require('../models/book')

router.get('/', async (req, res) => { // '/' For root page.
    let books

    try {
        books = await Book.find().sort({ createdAt: 'desc' }).limit(3).exec()

        res.render('index', { books: books })
    } catch (error) {
        books = []
        console.log(error)

    }

})

module.exports = router