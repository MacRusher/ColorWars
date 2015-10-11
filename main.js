AccountsGuest.enabled = true;
AccountsGuest.forced = false;
AccountsGuest.name = true;
AccountsGuest.anonymous = false;

DocHead.setTitle('ColorWars');
DocHead.addMeta({name: 'viewport', content: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1'});

System.import('/app').then(() => {
    // app is up and ready
});