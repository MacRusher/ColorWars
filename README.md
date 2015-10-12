# ColorWars

This game is a submission for [Meteor Global Hackaton 2015](http://meteor-2015.devpost.com/)

## Concept

Games is based on a game concept called "flood it".
You can find lots of games with similar mechanics, but most of them are single player.

ColorWars brings new quality with online PVP! :D

You can play either with computer (when there is no one else online) or with other visitors, just join pending invitation or create new one.

## Rules

1. You start in a corner of the map.
2. Select color you want to flood into.
2. You will take all tiles with this color that are adjacent to your currently own tiles.
3. You cannot select your or your opponent current selected color.
4. After your turn opponent floods into his selected color.
5. Game ends when there are no "free" tiles on the map.
6. Whoever floods into more tiles wins!

## Try it out!

You can play it online at:

[colorwars.meteor.com](http://colorwars.meteor.com/)

## Future plans

If people will like it I will continue work on this game, adding mobile versions, new modes, extra goodies and fixing bugs :)

## Used packages

Core packages:

- meteor-base etc.
- accounts-password
- ecmascript
- check
- underscore
- react

Community packages:

- universe:modules
- universe:collection
- universe:utilities
- universe:utilities-react

- kadira:react-layout
- kadira:dochead
- semantic:ui and flemay:less-autoprefixer
- artwells:accounts-guest
