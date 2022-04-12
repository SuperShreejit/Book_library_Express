const mongoose = require('mongoose')
// const path = require('path')

// commented out code is for multer package use : currently using filepath

// const coverImageBasePath = 'uploads/bookCovers'

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'The book must have a name'],
    maxlength: [50, 'the book title can be of maximum of 50 characters'],
    trim: true
  },
  description: {
    type: String,
  },
  publishDate: {
    type: Date,
    required: [true, "The book must have a published date"]
  },
  pageCount: {
    type: Number,
    require: [true, "Please mention the number of pages the book has"],
  },
  // coverImageName:{
  // typr: String,
  // required: [true, 'please provide book cover image' ]
  // },
  coverImage: {
    type: Buffer,
    required: [true, "Please provide the book cover image"]
  },
  coverImageType: {
    type: String,
    required: [true, 'Please provide the image file type']
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'Author',
    trim: true,
    required: [true, 'the book must have an author']
  }
}, { timestamps: true })

// BookSchema.virtual('coverImagePath').get(getPath)

// function getPath() {
//   if (this.coverImageName != null)
//     return path.join('/', coverImageBasePath, this.coverImageName)
// }

BookSchema.virtual('coverImagePath').get(getImage)

function getImage() {
  if (this.coverImage != null && this.coverImageType != null)
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
}  

module.exports = mongoose.model('Book', BookSchema)
// module.exports.coverImageBasePath = coverImageBasePath