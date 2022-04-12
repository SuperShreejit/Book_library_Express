const Book = require("../models/books")

const getHome = async (req, res) => {
  let books
  try {
    books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec()
    res.render('./home', {
      books:books,
      title: 'Library | Home'
    })
  } catch (error) {
    books = []
    res.redirect('/')
  }
}

module.exports = getHome