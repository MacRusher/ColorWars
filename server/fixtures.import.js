import {COMPUTER_ID} from '/collections/Games';

if (!Meteor.users.findOne(COMPUTER_ID)) {
    Meteor.users.insert({
        _id: COMPUTER_ID,
        username: 'ColorWars-Bot'
    });
}