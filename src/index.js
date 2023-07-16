import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

try {
  app.listen(PORT, () => {
    console.log(`Server running at port: ${PORT}`);
  });
} catch (error) {
  console.error(`Error starting the server: ${error.message}`);
}
