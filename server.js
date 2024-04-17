const app = require("./app");
const mongoose = require("mongoose");

const DB_HOST =
  "mongodb+srv://admin:6tX2et3iUcau2I9S@cluster0.dm5vj0r.mongodb.net/movie-site?retryWrites=true";

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => app.listen(3001))
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });
