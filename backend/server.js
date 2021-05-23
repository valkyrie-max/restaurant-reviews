import express from "express";
import cors from "cors";
import restaurants from "./api/restaurants.route.js";

const app = express()

// SETTING UP THE SERVER
app.use(cors())
// the server can accept json in the body in a request 
app.use(express.json())

// SPECIFYING INITIAL ROUTES
// main route
app.use("/api/v1/restaurants", restaurants)
// other routes that arent in our route file
app.use("*", (red, res) => res.status(404).json({error: "not found"}))

// exporting app as the module 
export default app