import {AutorunMixin} from '{universe:utilities-react}';

import Games, {status} from '/collections/Games';

import GameMap from './GameMap';

export default React.createClass({
    displayName: 'Game',
    mixins: [AutorunMixin],
    autorunGame () {
        Meteor.subscribe('game', this.props.id);

        let game = Games.findOne(this.props.id);
        let playerId = Meteor.userId();
        let opponentId;

        let playerData = {
            [playerId]: Meteor.users.findOne(playerId)
        };

        if (game) {
            opponentId = game.players.find(id => id !== playerId);
        }
        if (opponentId) {
            Meteor.subscribe('users', [opponentId]);
            playerData[opponentId] = Meteor.users.findOne(opponentId);
        }

        this.setState({
            game,
            playerData,
            playerId,
            opponentId,
            player: playerData[playerId],
            opponent: playerData[opponentId]
        });
    },
    render () {
        let {game, playerId, player, opponentId, opponent, playerData} = this.state;
        if (!game) {
            return <div className="ui segment loading"></div>;
        }

        if (game.status === status.ENDED) {
            return (
                <div className="ui segment center aligned">
                    <h2 className="ui header">Game ended</h2>

                    <h1 className="ui header">
                        {game.winner ? (game.winner === playerId ? 'You win!' : 'You loose!') : 'Draw!'}
                    </h1>

                    <button className="ui big teal button"
                            onClick={() => game.call('goBackToLobby')}>
                        Go back to lobby
                    </button>
                </div>
            );
        }

        let title;
        if (game.map.turn === playerId) {
            title = 'Your turn!'
        } else if (game.map.turn === opponentId) {
            title = `${opponent ? opponent.username : 'Opponent'} turn!`;
        }

        let isOnTop = game.players[0] === playerId;

        let points = {
            [playerId]: 0,
            [opponentId]: 0
        };

        if (game.map.table) {
            game.map.table.forEach(row => {
                row.forEach(tile => {
                    if (tile.owner) {
                        points[tile.owner]++;
                    }
                });
            });
        }

        return (
            <div className="ui grid segment">
                <div className="row">
                    <div className="column">
                        <h2 className="ui teal header">
                            {title}
                            <button className="ui button red right floated"
                                    onClick={() => game.call('surrender')}>
                                Surrender
                            </button>
                        </h2>
                    </div>
                </div>

                <div className="ui divider"></div>

                <div className="row">
                    <PlayerLabel n={0} playerData={playerData} game={game} points={points}/>
                </div>
                {isOnTop ?
                    <div className="row">
                        <Buttons pos="top" game={game}/>
                    </div>
                    : ''}
                <div className="row">
                    <div className="center aligned column">
                        <GameMap game={game} playerId={this.state.playerId}/>
                    </div>
                </div>
                {isOnTop ? '' :
                    <div className="row">
                        <Buttons pos="bottom" game={game}/>
                    </div>
                }
                <div className="row">
                    <PlayerLabel n={1} playerData={playerData} game={game} points={points}/>
                </div>
            </div>
        );
    }
});

const PlayerLabel = React.createClass({
    render () {
        let id = this.props.game.players[this.props.n];
        let user = this.props.playerData[id];

        if (!user) {
            return <div>loading...</div>
        }

        let color = UniUtils.get(this, `props.game.map.color.${id}`);

        return (
            <div className="center aligned column">
                <h3 className={`ui header color-${color}`}>{user.username}: {this.props.points[id]}</h3>
            </div>
        );
    }
});
const Buttons = React.createClass({
    render () {
        let {pos, game} = this.props;

        let playerId = game.players[pos === 'top' ? 0 : 1];

        let disabled = _.values(game.map.color || {});
        let disableAll = game.map.turn !== playerId;

        return (
            <div className="center aligned column">
                {_.range(6).map(color => {
                    let disable = disableAll || _(disabled).contains(color);
                    let css = [`bgcolor-${color}`, 'select-button'];
                    if (disable) {
                        css.push('disabled');
                    }
                    return <div className={css.join(' ')}
                                onClick={() => {!disable && game.call('makeMove', color)}}
                                key={color}>&nbsp;</div>;
                })}
            </div>
        );
    }
});