import {AutorunMixin} from '{universe:utilities-react}';

import Login from './Login';
import Lobby from './Lobby';
import Game from './Game';

export default React.createClass({
    displayName: 'App',
    mixins: [AutorunMixin],
    autorunUser () {
        Meteor.subscribe('me');
        let user = Meteor.user();
        this.setState({
            isLoggedIn: !!user,
            isPlaying: user && user.playing
        });
    },
    render () {
        if (this.state.isPlaying) {
            return <Game id={this.state.isPlaying}/>;
        }
        if (this.state.isLoggedIn) {
            return <Lobby />;
        }
        return <Login />;
    }
});