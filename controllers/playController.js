const router = require('express').Router();
const { isUser, isOwner } = require('../middlewares/guards');
const { parseError } = require('../util/parser');
const { preloadPlay } = require('../middlewares/preloads');
const { checkPlayForLikes } = require('../util/checkLikes');
const { body, validationResult } = require('express-validator');


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
        play.userLikedIt = checkPlayForLikes(play, req.user._id)
        console.log(play.userLikedIt)
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

router.post('/edit/:id', isUser(),
    body('title').trim().notEmpty().withMessage('Tittle should be not empty'),
    body('description').trim().notEmpty().withMessage('Description should be not empty').bail().
        isLength({ max: 50 }).withMessage('Description cannot be more than 50 charachters'),
    body('imageUrl').trim().notEmpty().withMessage('ImageUrl should be not empty'),
    async (req, res) => {

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
                _id: req.params.id,
                title: req.body.title,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                public: Boolean(req.body.public),

            }
            const ctx = {
                errors: parseError(err),
                play
            }
            console.log(ctx)
            res.render('play/edit', ctx)

        }
    })


router.get('/like/:id', async (req, res) => {
    const userId = req.user._id;
    const playId = req.params.id;
    try {
        await req.storage.likePlay(userId, playId);
        res.redirect(`/play/details/${playId}`)
    } catch (err) {
        console.log(err.message);
        res.redirect(`/play/details/${playId}`);
    }
})



router.get('/delete/:id', isUser(), async (req, res) => {
    await req.storage.deletePlay(req.params.id);
    res.redirect('/');
})


router.get('/sort/desc', async (req, res) => {
    const plays = await req.storage.sortByDates();
    res.render('home', { plays })
})

router.get('/sort/likes', async (req, res) => {
    const plays = await req.storage.sortByLikes();
    res.render('home', { plays })
})


module.exports = router;
