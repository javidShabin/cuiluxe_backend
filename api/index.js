import serverless from "serverless-http";
import app from "../index.js";  // Import your express app

export const handler = serverless(app);
export default app;
