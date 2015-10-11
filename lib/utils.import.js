export function generateMap ({size = 10, players = [], numberOfColors = 6}) {
    let [player1, player2] = players;
    check([player1, player2], [String]);

    let table = new Array(size);

    for (let row = 0; row < size; row++) {
        table[row] = new Array(size);

        for (let col = 0; col < size; col++) {
            table[row][col] = {
                color: Math.floor((Math.random() * numberOfColors)),
                owner: null
            }
        }
    }
    let firstTile = table[0][0];
    let lastTile = table[size - 1][size - 1];

    firstTile.owner = player1;
    firstTile.color = 'x';
    lastTile.owner = player2;
    lastTile.color = 'x';

    return {
        turn: player1,
        color: {
            [player1]: firstTile.color,
            [player2]: lastTile.color
        },
        table
    }
}

export function makeNextMove ({map, color, playerId, players}) {
    let [player1, player2] = players;

    if (_.chain(map.color).values().contains(color).value()) {
        throw 'This color is occupied';
    }

    if (map.turn !== playerId) {
        throw 'Wrong player';
    }

    let table = map.table;
    let coord = [0, 0];

    if (playerId === player1) {
        map.turn = player2;
    } else if (playerId === player2) {
        map.turn = player1;
        coord = [map.table.length - 1, map.table.length - 1];
    }

    map.color[playerId] = color;

    flood({table, coord, color, playerId, processed: {}});

    return map;
}


export function makeAIMove ({map, computerId, players}) {
    let playerId = players[0];
    if (map.turn !== computerId) {
        throw 'Not computer turn';
    }

    let table = map.table;
    let coord = [map.table.length - 1, map.table.length - 1];

    let {color} = _(_.range(6))
        .difference(_.values(map.color))
        .map(color => {
            return {
                color,
                score: simulateAIScore({
                    table: JSON.stringify(table),
                    coord,
                    color,
                    computerId
                })
            }
        })
        .reduce((best, current) => current.score > best.score ? current : best);

    map.color[computerId] = color;
    map.turn = playerId;

    flood({table, coord, color, playerId: computerId, processed: {}});

    return map;
}

function flood ({table, coord, color, playerId, processed}) {
    let [x, y] = coord;

    let tile = table[x] && table[x][y];

    if (!tile) {
        // out of boundary, stop
        return;
    }

    if (processed[x + '.' + y]) {
        // already processed, stop
        return;
    } else {
        // mark as processed and continue
        processed[x + '.' + y] = true;
    }

    if (tile.owner === playerId) {
        // own tile, continue
        tile.color = color;

    } else if (tile.owner) {
        // opponent tile, stop
        return;

    } else if (tile.color === color) {
        // matching tile, continue
        tile.owner = playerId

    } else {
        // other color tile, stop
        return;
    }

    flood({table, color, playerId, processed, coord: [x, y + 1]});
    flood({table, color, playerId, processed, coord: [x, y - 1]});
    flood({table, color, playerId, processed, coord: [x + 1, y]});
    flood({table, color, playerId, processed, coord: [x - 1, y]});

}

export function isFinished (map) {
    return !_(map.table).some(row => {
        return _(row).some(tile => {
            return tile.owner == null;
        });
    })
}

export function getWinner (game) {
    let [player1, player2] = game.players;
    let points = {
        [player1]: 0,
        [player2]: 0
    };

    game.map.table.forEach(row => {
        row.forEach(tile => {
            if (tile.owner) {
                points[tile.owner]++;
            }
        });
    });

    if (points[player1] > points[player2]) {
        return player1;
    } else if (points[player1] < points[player2]) {
        return player2;
    } else {
        // draw
        return;
    }
}

function simulateAIScore ({table, coord, color, computerId}) {
    table = JSON.parse(table);

    flood({table, coord, color, playerId: computerId, processed: {}});

    return calculateAIScore(table, computerId);
}

function calculateAIScore (table, computerId) {
    let points = 0;
    table.forEach(row => {
        row.forEach(tile => {
            if (tile.owner === computerId) {
                points++;
            }
        });
    });
    return points;
}