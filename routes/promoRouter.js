

const express = require("express");
const Promotions = require("../models/promotions");
const promoRouter = express.Router();

// I'm using Express 4.17, so there's no need for body-parser anymore
promoRouter.use(express.json());

promoRouter
   .route("/")
   .get((req, res, next) => {
      Promotions.find({})
         .then(
            promotions => {
               res.statusCode = 200;
               res.setHeader("Content-Type", "application/json");
               res.json(promotions);
            },
            err => next(err)
         )
         .catch(err => next(err));
   })
   .post((req, res, next) => {
      Promotions.create(req.body)
         .then(
            promotion => {
               console.log("Promotion Created ", promotion);
               res.statusCode = 200;
               res.setHeader("Content-Type", "application/json");
               res.json(promotion);
            },
            err => next(err)
         )
         .catch(err => next(err));
   })
   .put((req, res, next) => {
      res.statusCode = 403;
      res.end("PUT operation not supported on /promotions");
   })
   .delete((req, res, next) => {
      Promotions.remove({})
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

promoRouter
   .route("/:promotionId")
   .get((req, res, next) => {
      Promotions.findById(req.params.promotionId)
         .then(
            promotion => {
               res.statusCode = 200;
               res.setHeader("Content-Type", "application/json");
               res.json(promotion);
            },
            err => next(err)
         )
         .catch(err => next(err));
   })
   .post((req, res, next) => {
      res.statusCode = 403;
      res.end(
         "POST operation not supported on /promotions/" + req.params.promotionId
      );
   })
   .put((req, res, next) => {
      Promotions.findByIdAndUpdate(
         req.params.promotionId,
         {
            $set: req.body
         },
         { new: true }
      )
         .then(
            promotion => {
               res.statusCode = 200;
               res.setHeader("Content-Type", "application/json");
               res.json(promotion);
            },
            err => next(err)
         )
         .catch(err => next(err));
   })
   .delete((req, res, next) => {
      Promotions.findByIdAndRemove(req.params.promotionId)
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

module.exports = promoRouter;
