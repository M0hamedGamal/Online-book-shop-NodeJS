const mongoose = require('mongoose')

const path = require('path')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Authors'

    }
})

bookSchema.virtual('coverImagePath').get(function() {
    const book = this
    if(book.coverImageName){
        return path.join('/', 'uploads/bookCovers', book.coverImageName)
    }
})


const Book = mongoose.model('Books', bookSchema)

module.exports = Book