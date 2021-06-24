const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isGuest } = require('../middlewares/guards');
//TO DO add Guards

router.get('/register', isGuest(), (req, res) => {

    res.render('user/register', { title: 'Register' })
});

router.post('/register', isGuest(),
    body('username').isLength({ min: 3 }).withMessage('Username must be at leats 3 charachters long').bail().
        isAlphanumeric().withMessage('Username may contain only Latin letters and digits'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at leats 3 charachters long').bail().
        isAlphanumeric().withMessage('Password may contain only Latin letters and digits'),
    body('rePass').custom((value, { req }) => {
        if (value != req.body.password) {
            throw new Error(`Password don't match`);
        };
        return true;
    }),
    async (req, res) => {
        const { errors } = validationResult(req);
        try {
            if (errors.length > 0) {
                const message = errors.map(e => e.msg).join('\n')
                throw new Error(message);
            }
            await req.auth.register(req.body.username, req.body.password);
            res.redirect('/');
        } catch (err) {
            console.log(req.storage)
            const ctx = {
                errors: err.message.split('\n'),
                userData: {
                    username: req.body.username,
                }
            }
            res.render('user/register', ctx);
        };
    });

router.get('/login', isGuest(), (req, res) => {
    res.render('user/login', { title: 'Login' })
})

router.post('/login', async (req, res) => {
    try {
        await req.auth.login(req.body.username, req.body.password);
        res.redirect('/');
    } catch (err) {
        console.log(err.message);
        let errors = [err.message];
        if (err.type == 'credential') {
            errors = ['Incorrect Username or Password']
        }
        const ctx = {
            errors,
            userData: {
                username: req.body.username,
            }
        }
        res.render('user/login', ctx);
    };

});

router.get('/logout', (req, res) => {
    req.auth.logout();
    res.redirect('/')
});

module.exports = router;