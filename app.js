// external modules
require('dotenv').config()
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')

// internal modules
const {home , books , authors } = require('./route/index')
const connectDB = require('./db/connect')

// statics
app.use(express.static('public'))
app.use('/css',express.static(`${__dirname}/public/css`))
app.use('/js', express.static(`${__dirname}/public/js`))
app.use('/res', express.static(`${__dirname}/public/res`))

// views
app.use(expressLayouts)
app.set('view engine','ejs')
app.set('views', `${__dirname}/views`)
app.set('layout','layouts/layout')

// middlewares
app.use(express.urlencoded({ limit: '10mb', extended: false }))
app.use(express.json())
app.use(methodOverride('_method'))

// routes
app.use('/',home)
app.use('/',books)
app.use('/',authors) 

// initialize
const port = process.env.PORT || 3000
const start = async ()=>{
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port,()=>console.log(`Server is listening at ${port}`))
  } catch (error) {
    console.error(error)
  }
}
start()