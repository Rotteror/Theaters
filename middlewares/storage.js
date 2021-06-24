const userService = require('../services/user')
const playService = require('../services/play')

module.exports = () => (req, res, next) => {
    //TO DO import and decorate services 
    req.storage = {
        ...userService,
        ...playService
    };

    next();
}