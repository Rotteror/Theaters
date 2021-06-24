const router = require('express').Router();
const { isUser, isOwner } = require('../middlewares/guards');
const { parseError } = require('../util/parser');
const { preloadPlay } = require('../middlewares/preloads');


router.get('/create', isUser(), async (req, res) => {
    //TODO APPLY NEW STRUCTURE
    res.render('play/create')
})

router.post('/create', isUser(), async (req, res) => {

    try {
        const playData = {
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            public: Boolean(req.body.public),
            userLikes: [],
            author: req.user._id
        }

        await req.storage.createPlay(playData);
        res.redirect('/');
    } catch (err) {
        console.log(err.message)
        const ctx = {
            errors: parseError(err),
            playData:
            {
                title: req.body.title,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                public: Boolean(req.body.public),
                userLikes: [],
                author: req.user._id
            }
        }
        res.render('play/create', ctx)
    }
});

router.get('/details/:id', preloadPlay(), async (req, res) => {
    const play = req.data.play;
    if (play == undefined) {
        throw new Error('Invalid data');
    } else {
        play.isOwner = req.user && (play.author == req.user._id);
        play.userLikedIt = play.userLikes.some(p => p.objectId == req.user._id);
        const ctx = {
            play
        }

        res.render('play/details', ctx);
    }
});

router.get('/edit/:id', preloadPlay(), isUser(), async (req, res) => {
    const play = req.data.play;
    if (!play) {
        res.redirect('/');
    } else {
        const ctx = {
            play
        };
        res.render('play/edit', ctx)
    }
})

router.post('/edit/:id', isUser(), async (req, res) => {

    if (req.body.author != req.user_id) {
        throw new Error('Invalid operation')
    }

    try {
        const play = {
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            public: Boolean(req.body.public),

        }
        await req.storage.editPlay(req.params.id, play);
        res.redirect('/')
    } catch (err) {
        console.log(err.message);
        const play = {
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            public: Boolean(req.body.public),

        }
        const ctx = {
            errors: parseError(err),
            play
        }
        res.render('play/edit', ctx);
       
    }
})

router.get('/delete/:id', isUser(), async (req, res) => {
    await req.storage.deletePlay(req.params.id);
    res.redirect('/');
})


module.exports = router;
