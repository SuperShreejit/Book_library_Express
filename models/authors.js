const mongoose = require('mongoose')
const Book = require('./books')

const AuthorSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please provide author name'],
    maxlength: [30, 'Max characters for author name is 30']
  }
}, { timestamps: true })

AuthorSchema.pre('remove', function (next) {
  Book.find({ author: this.id },
    (err, books) => {
      if (err) next(err)
      else if (books.length > 0)
        next(new Error('This author has books, please remove the books first'))
      else next()
  })
})

module.exports = mongoose.model('Author', AuthorSchema)