const express = require('express')
const router = express.Router()
const Book = require('../models/book')

router.get('/',  async (req, res) => { // '/' For root page.
    let books

    try {
        books = await Book.find().sort({ createdAt: 'desc'}).limit(5).exec()
    } catch (error) {
        books = []
        console.log('Error')

    }

    res.render('index', {
        books: books
    })

})

module.exports = router