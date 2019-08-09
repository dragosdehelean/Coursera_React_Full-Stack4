const express = require("express");
const Favorites = require("../models/favorites");
const favoritesRouter = express.Router();
const authenticate = require("../authenticate");


favoritesRouter.route("/").get((req, res, next) => {
   Favorites.find({})
    //   .populate("comments.author")
    //   .then(
    //      dishes => {
    //         res.statusCode = 200;
    //         res.setHeader("Content-Type", "application/json");
    //         res.json(dishes);
    //      },
    //      err => next(err)
    //   )
    //   .catch(err => next(err));
    
});

module.exports = favoritesRouter;