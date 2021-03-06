const db = require("../models")

module.exports = socket => ({groupId}) => {

    if(!groupId) {
        socket.emit('getGroupMember',{status: 400,msg: 'Missing Group Id'})
        return
    }

    db.Group
        .findById(groupId)
        .select('member')
        .exec()
        .then(doc => {
            if(!doc) return []
            return db.User
                .find({_id: {$in: doc.member}})
                .select('_id name')
                .exec()
        })
        .then(data => {
            socket.emit('getGroupMember',{groupId,data})
        })
}