import '/server/publications@server';
import '/server/fixtures@server';

import App from '/components/App';
import Layout from '/components/Layout';

if (Meteor.isClient) {
    ReactLayout.render(Layout, {
        content: <App />
    });
}