const router = require('express').Router();


router.get('/', async (req, res) => {
    //TODO APPLY NEW STRUCTURE

    let hotels = await req.storage.getAllHotels();
    hotels.sort((a, b) => b.rooms - a.rooms);
    
    res.render('home/home', { hotels })
})


module.exports = router;
