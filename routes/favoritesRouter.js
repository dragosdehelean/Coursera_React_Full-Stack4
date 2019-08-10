const express = require("express");
const Favorites = require("../models/favorite");
const favoritesRouter = express.Router();
const authenticate = require("../authenticate");

favoritesRouter
   .route("/")
   .get(authenticate.verifyUser, (req, res, next) => {
      Favorites.find({})
         .populate("user")
         .populate("dishes")
         .then(
            favorites => {
               res.statusCode = 200;
               res.setHeader("Content-Type", "application/json");
               res.json(favorites);
            },
            err => next(err)
         )
         .catch(err => next(err));
   })
   .post(authenticate.verifyUser, (req, res, next) => {
      Favorites.findOneAndUpdate(
         { user: req.user._id },
         { $addToSet: { dishes: { $each: req.body.map(dish => dish._id) } } },
         { upsert: true, new: true }
      )
         .then(
            favorite => {
               res.statusCode = 200;
               res.setHeader("Content-Type", "application/json");
               res.json(favorite);
            },
            err => next(err)
         )
         .catch(err => next(err));
   })
   .delete(authenticate.verifyUser, (req, res, next) => {
      Favorites.findOneAndDelete({ user: req.user._id })
         .then(
            resp => {
               res.statusCode = 200;
               res.setHeader("Content-Type", "application/json");
               res.json(resp);
            },
            err => next(err)
         )
         .catch(err => next(err));
   });

favoritesRouter
   .route("/:dishId")
   .post(authenticate.verifyUser, (req, res, next) => {
      Favorites.findOneAndUpdate(
         { user: req.user._id },
         {
            $addToSet: { dishes: req.params.dishId }
         },
         { upsert: true, new: true }
      )
         .then(
            favorite => {
               res.statusCode = 200;
               res.setHeader("Content-Type", "application/json");
               res.json(favorite);
            },
            err => next(err)
         )
         .catch(err => next(err));
   })
   .delete(authenticate.verifyUser, (req, res, next) => {
      Favorites.findOneAndUpdate(
         { user: req.user._id },
         {
            $pull: { dishes: req.params.dishId }
         },
         { new: true }
      )
         .then(
            resp => {
               res.statusCode = 200;
               res.setHeader("Content-Type", "application/json");
               res.json(resp);
            },
            err => next(err)
         )
         .catch(err => next(err));
   });

module.exports = favoritesRouter;
