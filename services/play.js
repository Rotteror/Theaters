const Play = require('../models/Play');


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
    if(!play){
        throw new Error('Invalid data');
    }
    return play.deleteOne();
}

module.exports = {
    createPlay,
    getAllPlays,
    editPlay,
    getPlayById,
    deletePlay,
}
