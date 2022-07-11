const mongoose = require("mongoose");

mongoose
  .connect(
    process.env.DB_USER_PASS,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));
