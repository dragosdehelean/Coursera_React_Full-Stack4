var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require("./models/users");
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
var jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
const Dishes = require("./models/dishes");

var config = require("./config.js");

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
   return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
   new JwtStrategy(opts, (jwt_payload, done) => {
      console.log("JWT payload: ", jwt_payload);
      User.findOne({ _id: jwt_payload._id }, (err, user) => {
         if (err) {
            return done(err, false);
         } else if (user) {
            return done(null, user);
         } else {
            return done(null, false);
         }
      });
   })
);

exports.verifyUser = passport.authenticate("jwt", { session: false });

exports.verifyAdmin = (req, res, next) => {
   if (req.user.admin) {
      next();
   } else {
      err = new Error("You are not authorized to perform this operation");
      err.status = 403;
      next(err);
   }
};

exports.userIsOwner = (req, res, next) => {
   Dishes.findById(req.params.dishId).then(dish => {
        console.log("Uite ce am in baza de date: " + dish.comments.id(req.params.commentId).author._id);
        console.log(
           "Uite ce-mi vine pe req dupa parsare: " + req.user._id
        );
      if (dish.comments.id(req.params.commentId).author._id.equals(req.user._id)) {
         next();
      } else {
         err = new Error("You are not authorized to perform this operation");
         err.status = 403;
         next(err);
      }
   });
};
