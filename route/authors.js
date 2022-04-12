const express = require('express')
const router = express.Router()

const { getAllAuthors, createAuthorForm, createAuthor, getAuthor, editAuthor, updateAuthor, deleteAuthor } = require('../controllers/authors')

router.route('/authors').get(getAllAuthors)
router.route('/authors/new').get(createAuthorForm).post(createAuthor)
router.route('/authors/:id').get(getAuthor).delete(deleteAuthor)
router.route('/authors/:id/edit').get(editAuthor).patch(updateAuthor)

module.exports = router 