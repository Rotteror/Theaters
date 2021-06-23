const router = require('express').Router();


router.get('/', async (req, res) => {
    //TODO APPLY NEW STRUCTURE
    
     res.render('home')
})


module.exports = router;
