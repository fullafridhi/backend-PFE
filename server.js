const express = require("express");
require("dotenv").config();
const AppError = require("./utils/appError");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const globalErrorHandler = require("./controller/errorController");

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000", // Change this to your frontend URL
    credentials: true, // Allow cookies to be sent
  })
);

app.use(express.json({ limit: "10kb" }));

//importing Routes
const userRouter = require("./routes/userRouters");
const coursesRouter = require("./routes/coursRoutes")
const adminRoute = require("./routes/adminRouter");
const videoRoute = require("./routes/videoRoute");

//using Routes
app.use("/api/users", userRouter);
app.use("/api", coursesRouter)
app.use("/api/admin", adminRoute);
app.use("/api/videos", videoRoute);



app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

//Database connection
const dataConncet = require("./config/dataConnect");

dataConncet();

// Port connection
const port = process.env.PORT || 5001;

app.listen(port, () => console.log(`my server is running in port${port}`));
