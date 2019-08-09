const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var favoriteSchema = new Schema(
   {
      rating: {
         type: Number,
         min: 1,
         max: 5,
         required: true
      },
      comment: {
         type: String,
         required: true
      },
      author: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      }
   },
   {
      timestamps: true
   }
);



var Favorites = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorites;
