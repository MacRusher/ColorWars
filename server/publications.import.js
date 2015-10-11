import Games from '/collections/Games';

Meteor.publish('me', function () {
    return Meteor.users.find({
        _id: this.userId
    }, {
        fields: {
            playing: 1
        }
    })
});

Meteor.publish('users', function (userIds) {
    check(userIds, [String]);
    return Meteor.users.find({
        _id: {
            $in: userIds
        }
    }, {
        fields: {
            username: 1,
            playing: 1
        }
    });
});

Meteor.publish('pendingGames', function () {
    return Games.find({status: 'pending'});
});

Meteor.publish('game', function (_id) {
    check(_id, String);
    return Games.find({_id});
});