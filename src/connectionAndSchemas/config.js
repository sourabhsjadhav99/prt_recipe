let mongoose = require("mongoose")
let url = process.env.MONGO_URL
mongoose
  .connect(url, { useUnifiedTopology:true,
    useNewUrlParser: true})
  .then(() => {
    console.log("Connected to the database ");
  })
  .catch((err) => {
    console.log(`Error connecting to the database. n${err}`);
  });