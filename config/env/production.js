'use strict';

module.exports = {
    db: "mongodb://st362:rumbasamba@dharma.mongohq.com:10061/app20720888",
    //db: "mongodb://heroku:3e09a00238e4f66456518a290537d81c@dharma.mongohq.com:10061/app20720888",
    app: {
        name: "SolarMongo - A Modern CRM - Production"
    },
    google: {
        clientID: "1028720550280-mq35e7pihf64fc01go2jp0v961v5o7i7.apps.googleusercontent.com",
        clientSecret: "rylhUu_M_4mHSDrCa7YRMQrT",
        callbackURL: "http://solarmongo.herokuapp.com/auth/google/callback"
    }
}
