import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import routes from "./routes";
import swaggerUi from "swagger-ui-express";
import * as fs from "fs";
import * as path from "path";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", routes);

// Swagger Documentation
const swaggerPath = path.join(__dirname, "swagger.json");
if (fs.existsSync(swaggerPath)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf8"));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Error Handling Middleware (Based on PDF Rules)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  
  let status = err.status || 500;
  const message = err.message || "Internal Server Error";

  if (message.includes("InvalidDateRangeException") || message.includes("CapacityExceededException")) {
    status = 400;
  } else if (message.includes("RoomUnavailableException") || message.includes("InvalidReservationStateException")) {
    status = 409;
  } else if (message.includes("Check-in window violation")) {
    status = 422;
  } else if (message.includes("not found")) {
    status = 404;
  }

  res.status(status).json({
    error: message,
    timestamp: new Date().toISOString(),
    path: req.path
  });
});

export default app;
