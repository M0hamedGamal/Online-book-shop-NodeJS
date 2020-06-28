const mongoose = require('mongoose')

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
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
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
    if(book.coverImage && book.coverImageType){
        return `data:${book.coverImageType};charset=utf-8;base64,${book.coverImage.toString('base64')}`
    }
})


const Book = mongoose.model('Books', bookSchema)

module.exports = Book