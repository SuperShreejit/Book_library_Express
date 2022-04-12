const Author = require('../models/authors')
const Book = require('../models/books')

// get all authors/ filter authors
const getAllAuthors = async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  const authors = await Author.find({})
  try {
    res.render('./authors', {
      authors: authors,
      searchOptions: req.query,
      title: 'Library | Authors'
    })
  } catch (error) {
    res.render('./authors', {
      authors: authors,
      errMsg: 'Error searching authors',
      searchOptions: req.query,
      title: 'Library | Authors'
    })
  }
}

// create author
const createAuthorForm = async (req, res) => {
  res.render('./authors/newAuthor', { author: new Author(), title: 'Library | Create New Author' })
}

// save author
const createAuthor = async (req, res) => {
  const authorName = req.body.name
  const author = new Author({ name: authorName })
  try {
    const newAuthor = await author.save()
    res.redirect(`/authors/${newAuthor.id}`)
  } catch (error) {
    res.render('./authors/newAuthor', {
      author: author,
      errMsg: error.message,
      searchOptions: {},
      title: 'Library | Create New Author'
    })
  }
}

// show author
const getAuthor = async (req, res) => {
  const authors = await Author.find({})
  try {
    const authorId = req.params.id
    const author = await Author.findById(authorId)
    const books = await Book.find({ author: authorId })
    res.render('./authors/view', { author: author, books: books, title: `Library | Author: ${author.name}` })
  } catch (error) {
    res.render('./authors', {
      authors: authors,
      searchOptions: {},
      errMsg: 'Error finding author',
      title: 'Library | Authors'
    })
  }
}

// fetch edit author form
const editAuthor = async (req, res) => {
  try {
    const authorId = req.params.id
    const author = await Author.findById(authorId)
    res.render('./authors/editAuthor', { author: author, title: 'Library | Edit Author' })
  } catch (error) {
    res.render('./authors', {
      authors: authors,
      searchOptions: {},
      errMsg: 'Error editing authors',
      title: 'Library | Authors'
    })
  }
}

// update author
const updateAuthor = async (req, res) => {
  const authorId = req.params.id
  const query = req.body
  let author = await Author.findById(authorId)
  try {
    author = await Author.findByIdAndUpdate(authorId, query, { new: true, runValidators: true })
    res.redirect(`/authors/${authorId}`)
  } catch (error) {
    if (author == null) 
      res.redirect(`/authors`)
    else
      res.render(`./authors/${authorId}/editAuthor`, {
        author: author,
        errMsg: 'Error updating Author',
        title: 'Library | Edit Author'
      })
  }
}

// delete author
const deleteAuthor = async (req, res) => {
  const authorId = req.params.id
  const author = await Author.findById(authorId)
  const authors = await Author.find({})
  try {
    await author.remove()
    res.render('./authors', {
      authors: authors,
      searchOptions: {},
      title: 'Library | Authors'
    })
  } catch (error) {
    if (author != null)
      res.redirect('/authors')
    else
      res.render('./authors', {
        authors: authors,
        searchOptions: {},
        errMsg: 'Error deleting author',
        title: 'Library | Authors'
      })
  }
}

module.exports = { getAllAuthors, createAuthorForm, createAuthor, getAuthor, editAuthor, updateAuthor, deleteAuthor }