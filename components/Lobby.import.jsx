import {AutorunMixin} from '{universe:utilities-react}';

import Games from '/collections/Games';

import GamesListing from './GamesListing';

export default React.createClass({
    displayName: 'Lobby',
    mixins: [AutorunMixin],
    autorunUser () {
        this.setState({
            username: Meteor.user().username
        });
    },
    autorunGames () {
        Meteor.subscribe('pendingGames');

        let games = Games.find({status: 'pending'}, {sort: {createdAt: -1}}).fetch();
        let userIds = games.map(game => game.players[0]);

        Meteor.subscribe('users', userIds);

        this.setState({
            games,
            isPending: _(userIds).contains(Meteor.userId())
        });
    },
    render () {
        return (
            <div className="ui segment">
                <h2 className="ui teal header">
                    You're playing as <strong>{this.state.username}</strong>
                    <button className="ui button red right floated"
                            onClick={() => Meteor.logout()}>
                        Sign out
                    </button>
                </h2>

                <div className="ui divider"></div>

                <GamesListing games={this.state.games}/>

                <div className="ui divider"></div>

                {this.state.isPending ? '' :
                    <div>
                        <button className="ui big teal fluid button"
                                onClick={() => Games.call('createNewGame')}>
                            Start new game
                        </button>
                        <div className="ui divider"></div>
                        <button className="ui big purple fluid button"
                                onClick={() => Games.call('playWithComputer')}>
                            Play with computer
                        </button>
                    </div>
                }
            </div>
        );
    }
});