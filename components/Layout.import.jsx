export default React.createClass({
    displayName: 'Layout',
    render () {
        return (
            <div className="ui middle aligned center aligned grid container">
                <div className="row">
                    <div className="column">
                        {this.props.content}
                    </div>
                </div>
            </div>
        );
    }
});