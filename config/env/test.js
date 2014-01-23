'use strict';

module.exports = {
    db: "mongodb://localhost/mean-test",
    port: 3001,
    app: {
        name: "MEAN - A Modern Stack - Test"
    },
    google: {
        clientID: "APP_ID",
        clientSecret: "APP_SECRET",
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
    stripe: {
        key: "sk_test_tthcngkRTRH1BWnT9HrqhC1u"
    }
}