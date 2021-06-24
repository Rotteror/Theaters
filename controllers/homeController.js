const router = require('express').Router();


router.get('/', async (req, res) => {

    const plays = await req.storage.getAllPlays();

    //TO DO manage to take sort data from DB 
    
    plays.sort((a, b) => b.createdAt - a.createdAt);
    res.render('home', { plays })
})


module.exports = router;
