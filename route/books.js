const express=require('express')
const router = express.Router()
// const multer = require('multer')
// const path = require('path')

// the commented code is for when using multer: currently using filepond

const { getAllBooks, createBook, createBookForm, getBook, editBook, updateBook, deleteBook } = require('../controllers/books')
// const Book = require('../models/books')

// const uploadPath = path.join('public', Book.coverImageBasePath)
// const imageMimeTypes = [ 'image/jpeg', 'image/png', 'image/gif' ]
// const upload = multer({
//   dest: uploadPath,
//   fileFilter: (req, file, callback) => {
//     callback(null, checkFile(file.mimetype))
//   }
// })
 
// function checkFile(mimetype) {
//   let match = false
//   imageMimeTypes.forEach(type => {
//     if (mimetype == type) match = true
//   })
//   return match
// }

router.route('/books').get(getAllBooks)
router.route('/books/new').get(createBookForm).post(createBook)
router.route('/books/:id').get(getBook).delete(deleteBook)
router.route('/books/:id/edit').get(editBook).patch(updateBook)
// router.post('/books/new', upload.single('cover'), createBook)

module.exports = router