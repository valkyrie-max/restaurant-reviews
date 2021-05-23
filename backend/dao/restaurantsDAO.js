import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

// storing a reference to the database
let restaurants

// methods/ all asyns
export default class RestaurantsDAO {
    // initial connection to the db
    // calling this method as soon as the server starts to get the reference 
    static async injectDB(conn) {
        if (restaurants) {
            return
        } 
        try {
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in RestaurantsDAO: ${e}`
            )
        }
    }

    // calling to get the list of all restaurants
    static async getRestaurants({
        // made up options
        filters = null,
        page = 0,
        restaurantsPerPage = 20,
    } = {}) {
        // putting together a query
        let query
        if (filters) {
            // name filter
            // searching by the rest. name
            if ("name" in filters) {
                // specify in mongodb atlas is somebody does text search which filed will be searched for that specific string 
                query = { $text: { $search: filters["name"] } }
            // cuisine filter
            // eq = equals 
            } else if ("cuisine" in filters) {
                query = { "cuisine": { $eq: filters["cuisine"] } }
            // zipcode filter
            } else if ("zipcode" in filters) {
                query = { "address.zipcode": { $eq: filters["zipcode"] } }
            }
        }

        // Cursors are used by database programmers to process individual rows returned by database system queries. 
        // Cursors enable manipulation of whole result sets at once. 
        let cursor 
        try {
            // finding all restaurants  from the db that go along with the query
            cursor = await restaurants
                .find(query)
        } catch (e) {
            console.error(`Unable to issue find command: ${e}`)
            return { restaurantsList: [], totalNumRestaurants: 0 }
        }

        // limiting the results, to get the actual page - we're skipping 
        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)
        try {
            // setting an array
            const restaurantsList = await displayCursor.toArray()
            // to get the total number of rests, were counting number of docs in the query
            const totalNumRestaurants = await restaurants.countDocuments(query)

            // returning 
            return { restaurantsList, totalNumRestaurants }
        } catch(e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents: ${e}`
            )
            return { restaurantsList: [], totalNumRestaurants: 0 }
        }
    }

    static async getRestaurantsById(id) {
        try {
            // creating pipelines to help match diff collections together 
            const pipeline = [
                {
                    $match: {
                        _id: new ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: "reviews",
                        let: {
                            id: "$_id"
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$restaurant_id", "$$id"]
                                    },
                                },
                            },
                            {
                                $sort: {
                                    date: -1
                                },
                            },
                        ],
                        as: "reviews", 
                    },
                },
                {
                    $addFields: {
                        reviews: "$reviews"
                    },
                },
            ]
            return await restaurants.aggregate(pipeline).next()
        } catch (e) {
            console.error(`Something went wrong in getRestaurantById: ${e}`)
            throw e
        }
    }

    static async getCuisines() {
        let cuisines = []
        try {
            cuisines = await restaurants.distinct("cuisine")
            return cuisines
        } catch (e) {
            console.error(`Unable to get cuisines, ${e}`)
            return cuisines
        }
    }
}

