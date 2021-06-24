function checkPlayForLikes(play ,userId){

    if(play){
        return [...(Object.values(play.userLikes)).map(e => e + '')].includes(userId)
    }

}


module.exports = {
   checkPlayForLikes,
}