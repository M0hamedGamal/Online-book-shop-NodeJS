/* Type in terminal
 npm init -y
 npm i express ejs express-ejs-layouts  
 npm i nodemon --save-dev
 npm i mongoose
 npm i --save-dev dotenv
 git init
 -----Type When run the app into local host-----
 npm run dev-start          // Hint: [Check value of 'dev-start' code into package.json file]
 */

// process.env.NODE_ENV !== 'production' --> default running by node js but let we check. 
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({ path: 'env' });   // run the 'dotenv' lib & config the path of env
}

const express = require('express')  // Lib for server

const expressLayouts = require('express-ejs-layouts') // Lib for layouts of HTML for pages

const mongoose = require('mongoose') // Database.

const app = express()   // store all of functions of express into app const to use it latter

const indexRouter = require('./routes/index')

app.set('view engine', 'ejs')   // our view engine came from 'ejs'
app.set('views', __dirname + '/views')  // our views came from 'views folder'
app.set('layout', 'layouts/layout') // make header & footer for all of layout instead of duplicate it

app.use(expressLayouts) // use express layouts from the lib
app.use(express.static('public'))   // use public files like (HTML, CSS, JavaScript, Images)

app.use(indexRouter)    // Use the router of index

// Check value of 'Process.env.DATABASE_URL' into env file
mongoose.connect(process.env.DATABASE_URL, {    // connect to database 
    useNewUrlParser:true,
    useCreateIndex: true
})

const db = mongoose.connection  // connection to handdle the error or open

db.on('error', error => console.error(error))   // if it get an error.
db.once('open', () => console.log('Connected to mongoose!')) // if it connected.

app.listen(process.env.PORT || 3000)    // when we deploy this project make the environment get the port automatically. or use 3000 for local host
