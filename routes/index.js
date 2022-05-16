const express = require('express')
const router = express.Router()

router.get('/', (req,res)=>{
    //res.send('Okay server working')
    res.render('index')
})

module.exports = router

