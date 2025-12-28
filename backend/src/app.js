const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const authRoutes = require("./routes/auth.routes");
const notesRoutes = require("./routes/notes.routes");
const categoriesRoutes = require("./routes/categories.routes");
const errorHandler = require("./middleware/error.middleware");
const requestLogger = require("./middleware/requestLogger.middleware");

const app = express();

app.use(
  cors({
    origin: true, //dev mode
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/categories", categoriesRoutes);

app.use(errorHandler);

module.exports = app;
