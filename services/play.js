const Play = require('../models/Play');


async function createPlay(playData) {
    const play = new Play(hotelData);
    await play.save();

    return hotel;
}

async function getAllPlays() {
    const plays = await Play.find({}).lean();
    return plays
}

async function getPlayById(id) {
    const play = await Play.findById(id);
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

}

module.exports = {
    createPlay,
    getAllPlays,
    editPlay,
    getPlayById,
    deletePlay,
}
