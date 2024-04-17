const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/api/users");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";
console.log(process.env.NODE_ENV);

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/users", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = app;
