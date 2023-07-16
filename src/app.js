import express from "express";

const app = express();

app.post("/", (req, res) => {
  res.json({ message: "Hello World" });
});

export default app;
