function isUser() {
    return (req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.redirect('/auth/login');
        }
    };
}

function isGuest() {
    return (req, res, next) => {
        if (!req.user) {
            next();
        } else {
            res.redirect('/');
        }
    };
}
//TODO => THIS FUNCTION NEEDS REFACTORING
function isOwner() {
    return (req, res, next) => {
        if (req.data.play && req.user && (req.data.play.author == req.user._id)) {
            next();
        } else {
            res.redirect('/auth/login');
        }
    }
}



module.exports = {
    isUser,
    isGuest,
    isOwner
}