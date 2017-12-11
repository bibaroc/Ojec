module.exports =
    {
        //Secret to be used for jwt authentication.
        "secret": "wNZoIJ5DSYgoqLm1uK0gJuP4pfzmf5RMq0txIiWWhGNh6brGiRRe1Sul7OQ9ksxx",
        //String used to connect to mongo.
        "database": "mongodb://127.0.0.1:27017/somePlayGround",
        //Database options.
        "databaseOptions": {
            "server": {
                "socketOptions": {
                    "keepAlive": 666,
                    "connectTimeoutMS": 666
                }
            }
        },
        "trasportedPW": "********",
        "env": "dev"
    };