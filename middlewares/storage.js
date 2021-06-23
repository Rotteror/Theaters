const user = require('../services/user')
const play = require('../services/play')

module.exports = () => (req, res, next) => {
    //TO DO import and decorate services 
    req.storage = {
        ...user,
       
    };

    next();
}