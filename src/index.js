import dotenv from "dotenv";
import app from "./app.js";

import { modeLog } from "./configs/mode.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

try {
  app.listen(PORT, () => {
    console.log(`Running in ${modeLog(process.env.NODE_ENV)} mode.`);
    console.log(`Server running at port: ${PORT}`);
  });
} catch (error) {
  console.error(`Error starting the server: ${error.message}`);
}
