const Play = require('../models/Play');
const User = require('../models/User');
const { checkPlayForLikes } = require('../util/checkLikes');


async function createPlay(playData) {
    const play = new Play(playData);
    await play.save();

    return play;
}

async function getAllPlays() {
    const plays = await Play.find({}).lean();
    return plays
}

async function getPlayById(id) {
    const play = await Play.findById(id).lean();
    return play;
}

async function editPlay(id, play) {
    const currentPlay = await Play.findById(id);
    if (!currentPlay) {
        throw new Error('No such play ')
    }
    Object.assign(currentPlay, play);
    return currentPlay.save();
}

async function deletePlay(id) {
    const play = await Play.findById(id);
    if (!play) {
        throw new Error('Invalid data');
    }
    return play.deleteOne();
}

async function likePlay(userId, playId) {

    const currentUser = await User.findById(userId);
    const currentPlay = await Play.findById(playId);
    if (!currentUser) {
        throw new Error('Invalid username')
    }

    if (!currentPlay) {
        throw new Error("Invalid play");
    }

    const playLiked = checkPlayForLikes(currentPlay, userId);

    if (!playLiked) {
        currentPlay.userLikes.push(currentUser);
        currentUser.likedPlays.push(currentPlay);
        return Promise.all([(
            currentPlay.save(),
            currentUser.save())
        ]);
    } else {
        throw new Error('Invalid operation -> You already liked this Play dumb ass ')
    }

}

module.exports = {
    createPlay,
    getAllPlays,
    editPlay,
    getPlayById,
    deletePlay,
    likePlay,
}
