import {AutorunMixin} from '{universe:utilities-react}';

export default React.createClass({
    displayName: 'GamesListing',
    mixins: [AutorunMixin],
    autorun () {
        this.setState({userId: Meteor.userId()});
    },
    render () {
        if (this.props.games.length === 0) {
            return <h5>No games at the moment</h5>
        }

        return (
            <div className="ui six doubling cards">
                {this.props.games.map(game => <Card game={game}
                                                    key={game._id}
                                                    isYours={_(game.players).contains(this.state.userId)}/>
                )}
            </div>
        );
    }
});

const Card = React.createClass({
    mixins: [AutorunMixin],
    autorun () {
        this.setState({user: Meteor.users.findOne(this.props.game.players[0])});
    },
    render () {
        return (
            <div className="card">
                <div className="content">
                    <div className="header">{this.state.user && this.state.user.username}</div>
                    <div className="description">want to play!</div>
                </div>
                {this.props.isYours ?
                    <div className="ui bottom attached grey button"
                         onClick={() => this.props.game.call('cancelGame')}>
                        <i className="cancel icon"></i> Cancel game
                    </div>
                    :
                    <div className="ui bottom attached green button"
                         onClick={() => this.props.game.call('startGame')}>
                        <i className="play icon"></i> Play now!
                    </div>
                }
            </div>
        );
    }
});