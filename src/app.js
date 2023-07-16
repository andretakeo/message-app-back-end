import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import cors from "cors";

dotenv.config();

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(cookieParser());
app.use(compression());
app.use(cors());

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.post("/", (req, res) => {
  throw createHttpError.BadRequest("this route has an error");
});

app.use(async (req, res, next) => {
  next(createHttpError.NotFound("This route does not exist."));
});

// handling errors
app.use(async (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.get("/", (req, res) => {
  res.json("hello from server");
});

export default app;
