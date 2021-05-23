import app from './server.js';
import mongodb from 'mongodb';
import dotenv from 'dotenv'
import RestaurantsDAO from './dao/restaurantsDAO.js'
import ReviewsDAO from './dao/reviewsDAO.js'

// load environment variable
dotenv.config()

// connecting to the db
const MongoClient = mongodb.MongoClient;
const port = process.env.PORT || 8000

// connecting to the db (database)
MongoClient.connect(
    process.env.RESTREVIEWS_DB_URI, 
    {// options for accessing to the db
        poolSize: 50,
        wtimeout: 2500,
        useNewUrlParser: true}
    ).catch(error => {
        console.error(err.stack)
        process.exit(1)
    })
    .then(async client => {
        // getting our initial references to the rest. collection
        await RestaurantsDAO.injectDB(client)
        await ReviewsDAO.injectDB(client)
        // starting the webserver
        app.listen(port, () => {
            console.log(`listening on port ${port}!`)
        })
    })