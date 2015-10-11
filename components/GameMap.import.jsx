const Tile = new React.createClass({

    render () {
        let {color, owner} = this.props.col;

        let css = ['tile', `bgcolor-${color}`];

        if (!owner) {
            css.push('free');
        }

        if (color === 'x' && owner === Meteor.userId()) {
            css.push('glow');
        }

        return <div className={css.join(' ')}
                    onClick={() => this.props.selectColor(color)}
            >&nbsp;</div>
    }
});


export default React.createClass({
    displayName: 'GameMap',
    selectColor (color) {
        if (this.props.game.map.turn === this.props.playerId) {
            this.props.game.call('makeMove', color);
        }
    },
    render () {
        let table = this.props.game.map.table;

        if (!table) {
            return <div>loading map</div>;
        }

        return (
            <div className="game-table">
                {table.map((row, key) => {
                    return <div key={key} className="row">{
                        row.map((col, key) => <Tile col={col}
                                                    selectColor={this.selectColor}
                                                    key={key}/>
                        )
                    }</div>;
                })}
            </div>
        );
    }
});