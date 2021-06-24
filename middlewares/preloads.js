//TODO REFACTOR TO APPLY TO NEW PROJECT STRUCTURE

function preloadPlay() {
    return async (req, res, next) => {
        req.data = req.data || {};

        try {
            const play = await req.storage.getPlayById(req.params.id);
            if (play) {
                req.data.play = play;
            }
        } catch (err) {
            console.error('Database error: ', err.message);
        }
        next();
    }
}

module.exports = {
    preloadPlay
}