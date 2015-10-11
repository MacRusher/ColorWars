import {
    generateMap,
    makeNextMove,
    makeAIMove,
    isFinished,
    getWinner
} from '/lib/utils';

const Games = new UniCollection('Games');

const status = {
    PENDING: 'pending',
    PLAYING: 'playing',
    ENDED: 'ended'
};
const modes = {
    PVP: 'pvp',
    PVC: 'pvc'
};

const COMPUTER_ID = 'computer';

Games.setSchema(new SimpleSchema({
    status: {
        type: String,
        allowedValues: _.values(status)
    },
    mode: {
        type: String,
        allowedValues: _.values(modes)
    },
    players: {
        type: [String],
        minCount: 1,
        maxCount: 2
    },
    map: {
        type: Object,
        blackbox: true
    },
    winner: {
        type: String,
        optional: true
    }
}));

Games.methods({
    createNewGame: function () {
        if (Games.find({status: status.PENDING, players: this.userId}).count() > 0) {
            return;
        }

        Games.insert({
            status: status.PENDING,
            mode: modes.PVP,
            players: [this.userId],
            map: {}
        });
    },
    playWithComputer: function () {
        if (Meteor.isClient) {
            return;
        }

        Games.remove({
            status: status.PENDING,
            players: this.userId
        }, {multi: true});

        let players = [this.userId, COMPUTER_ID];

        let gameId = Games.insert({
            status: status.PLAYING,
            mode: modes.PVC,
            players,
            map: generateMap({players}),
        });

        setPlaying([this.userId], gameId);
    }
});

Games.docMethods({
    cancelGame: function () {
        this.document.remove();
    },
    startGame: function () {
        let {document: game, userId} = this;
        let players = [game.players[0], userId];

        setPlaying(players, game._id);

        if (Meteor.isClient) {
            return;
        }

        Games.remove({
            status: status.PENDING,
            players: userId
        }, {multi: true});

        game.update({
            $set: {
                status: status.PLAYING,
                map: Meteor.isServer ? generateMap({players}) : {},
                players
            }
        });
    },
    surrender: function () {
        let {document: game, userId} = this;

        game.update({
            $set: {
                status: status.ENDED,
                winner: game.players[0] === userId ? game.players[1] : game.players[0]
            }
        });
        //game.call('goBackToLobby');
    },
    goBackToLobby: function () {
        setPlaying([this.userId], null);
    },
    makeMove: function (color) {
        let {document: game, userId: playerId} = this;

        let map = makeNextMove({
            color,
            playerId,
            map: game.map,
            players: game.players
        });

        if (isFinished(map)) {
            game.update({
                $set: {
                    map,
                    status: status.ENDED,
                    winner: getWinner(game)
                }
            });
            return;
        }

        game.update({$set: {map}});

        if (Meteor.isServer && game.mode === modes.PVC) {
            game.call('moveAI');
        }
    },
    moveAI: function () {
        let game = this.document;

        console.time('moveAI');
        let map = makeAIMove({
            map: game.map,
            players: game.players,
            computerId: COMPUTER_ID
        });
        console.timeEnd('moveAI');

        if (isFinished(map)) {
            game.update({
                $set: {
                    map,
                    status: status.ENDED,
                    winner: getWinner(game)
                }
            });
            return;
        }

        game.update({$set: {map}});
    }
});

Games.allow({
    createNewGame: userId => !!userId,
    playWithComputer: userId => !!userId,
    startGame: (userId, doc) => !!userId && doc.status === status.PENDING && doc.players[0] !== userId,
    cancelGame: (userId, doc) => doc.status === status.PENDING && doc.players[0] === userId,
    surrender: (userId, doc) => doc.status === status.PLAYING && _(doc.players).contains(userId),
    makeMove: (userId, doc) => doc.status === status.PLAYING && doc.map.turn === userId,
    goBackToLobby: (userId, doc) => doc.status === status.ENDED
});

const setPlaying = (userIds, playing) => {
    check(userIds, [String]);
    Meteor.users.update({_id: {$in: userIds}}, {$set: {playing}}, {multi: true});
};

export default Games;
export {status, modes, COMPUTER_ID};