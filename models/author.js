const mongoose = require('mongoose')

const Book = require('./book')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

authorSchema.pre('remove', function(next){
    const author = this
    Book.find({author: author.id}, (error, books) => {
        if (error)
            next(error)
        else if (books.length > 0)
            next(new Error('This author has books still!'))
        else
            next()
    })
})

const Author = mongoose.model('Authors', authorSchema)

module.exports = Author

