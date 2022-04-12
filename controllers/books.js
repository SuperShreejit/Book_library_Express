const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const Book = require('../models/books')
const Author = require('../models/authors')
const {StatusCodes} = require('http-status-codes')

// the commented out code is for when you need to store files via multer: currently using filepond

// show all books / search book
const getAllBooks = async (req, res) => {
  let query = Book.find({})
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title,'i'))
  }
  if (req.query.publishBefore != null && req.query.publishBefore != '') {
    query = query.lte('publishDate', req.query.publishBefore)
  }
  if (req.query.publishAfter != null && req.query.publishafter != '') {
    query = query.gte('publishDate', req.query.publishAfter)
  }
  try {
    const books = await query.exec()
    res.render('./books', {
      books: books,
      searchOptions: req.query,
      title: 'Library | Books',
    })
  } catch (error) {
    res.redirect('/books')
  }
}

// render create book form
const createBookForm = async (req, res) => {
  rendernewPage(res,new Book())
}

// submit book to database
const createBook =  async (req, res) => {
  // const fileName = req.file != null ? req.file.filename : null
  
  const input = req.body
  const book = new Book({
    title: input.title,
    author: input.author,
    publishDate: new Date(input.publishDate),
    pageCount: input.pageCount,
    description: input.description,
    // coverImageName: fileName,
  })
  await saveCover(book, input.cover)

  try {
    const newBook = await book.save()
    res.redirect('/books')
  } catch (error) {
    // if(book.coverImageName!= null) removeBookCover(book.coverImageName)
    rendernewPage(res, book, true)   
  }
}

// show book
const getBook = async (req, res) => {
  const bookId = req.params.id
  const books = await Book.find({})
  try {
    const book = await Book.findById(bookId)
      .populate('author').exec()
    res.render('./books/view', {
      book: book,
      title: `Library | Book: ${book.title}`
    })
  } catch (error) {
    res.render('./books', {
      books: books,
      title: 'Library | Books',
    })
  }
}

// edit book form
const editBook = async (req, res) => {
  const bookId = req.params.id
  const book = await Book.findById(bookId)
  try {
    const authors = await Author.find({})
    res.render('./books/editBook', {
      book: book,
      authors: authors,
      title: 'Library | Edit Book'
    })
  } catch (error) {
    res.render('./books/view', {
      book: book,
      errMsg: `Error: ${error.message}`,
      title: `Library | Book: ${book.title}`
    })
  }
}

// update the edited book
const updateBook = async (req, res) => {
  const bookId = req.params.id
  const query = req.body
  const authors = await Author.find({})
  let book = await Book.findById(bookId)
  try {
    book = await Book.findByIdAndUpdate(bookId, query, { new: true, runValidators: true })
    res.render('./books/view', {
      book: book,
      title: `Library | Book: ${book.title}`
    })
  } catch (error) {
    if (book == null)
      res.redirect('/books')
    else
      res.render('./books/editBook', {
        book: book,
        authors: authors,
        errMsg: `Error updating Book: ${error.message}`,
        title: 'Library | Edit Book'
      })      
  }
}

// delete book
const deleteBook = async (req, res) => {
  const bookId = req.params.id
  const book = await Book.findById(bookId)
  try {
    const isDeleted = await Book.findByIdAndRemove(bookId)
    if(isDeleted) res.redirect('/books')
  } catch (error) {
    if (book != null)
      res.redirect('/books')
    else
      res.render('./books/view', {
        book: book,
        errMsg: `Error: ${error.message}`,
        title: `Library | Book: ${book.title}`
      })
  }
}

// save cover in dB
async function saveCover(book, encodedCover) {
  if (encodedCover == null) return
  const cover = JSON.parse(encodedCover)
  if (cover != null && checkFile(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64')
    book.coverImageType = cover.type
  }
}

// check file type
function checkFile(mimetype) {
  let match = false
  imageMimeTypes.forEach(type => {
    if (mimetype == type) match = true
  })
  return match
}

// render new page
async function rendernewPage(res, book, hasError = false ) {
  try {
    const authors = await Author.find({})
    const params = {
      book: book,
      authors: authors,
      title: 'Library | Create new Book',
    }

    if (hasError) params.errMsg = 'Error Creating Book'
    res.render('./books/newBook', params)
  } catch (err) {
    res.redirect('/books')
  }
}

// remove book cover from server
// async function removeBookCover(fileName) {
//   fs.unlink(path.join('public', Book.coverImageBasePath, fileName),err => console.error(err))
// }

module.exports = { getAllBooks, createBookForm, createBook, getBook, editBook, updateBook, deleteBook }