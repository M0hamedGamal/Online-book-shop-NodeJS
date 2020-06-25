const express = require('express')

const router = express.Router()

router.get('/', (req, res) => { // '/' For root page.
    res.render('index')

})

module.exports = router