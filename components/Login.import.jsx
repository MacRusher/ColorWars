export default React.createClass({
    displayName: 'Login',
    render () {
        return (
            <div className="ui segment">
                <h2 className="ui teal image header">
                    <img src="/colorwars.png" className="image"/>

                    <div className="content">
                        Welcome to ColorWars!
                    </div>
                </h2>

                {/*<h4 className="ui horizontal header divider">
                    <i className="user icon"></i>
                    Use permanent account
                </h4>*/}

                <h4 className="ui horizontal divider header">
                    <i className="spy icon"></i>
                    Play anonymously
                </h4>

                <button className="ui big teal fluid button"
                        onClick={() => Meteor.loginVisitor()}>
                    Play as a Guest!
                </button>
            </div>
        );
    }
});