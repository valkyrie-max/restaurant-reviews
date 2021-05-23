import express from 'express';
import RestaurantsCtrl from './restaurants.controller.js';
import ReviewsCtrl from './reviews.controller.js';

// getting access to the router
const router = express.Router()

// demo route
// router.route("/").get((req, res) => res.send('Hello World! uwu'))

router.route("/").get(RestaurantsCtrl.apiGetRestaurants)
router.route("/id/:id").get(RestaurantsCtrl.apiGetRestaurantsById)
router.route("/cuisines").get(RestaurantsCtrl.apiGetRestaurantsCuisines)

router
    .route("/review")
    // create
    // POST HTTP request
    .post(ReviewsCtrl.apiPostReview)
    // edit
    .put(ReviewsCtrl.apiUpdateReview)
    // delete
    .delete(ReviewsCtrl.apiDeleteReview)

export default router