if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExprexError.js");

const dbUrl = process.env.ATLASDB_URL;

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash"); 
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

main()
  .then(() => {
    console.log("connect to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error in  Mongo session  Store", err);
});
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true, // Prevents creating sessions for unauthenticated users
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};



app.use(session(sessionOptions)); // Session middleware
app.use(flash()); // Flash middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Make flash messages available globally
app.use((req, res, next) => {
  res.locals.success = req.flash("success"); // Assign the flash message to a local variable
  // console.log(res.locals.success);
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use(express.static('public'));

  

app.use((req, res) => {
    res.status(404).send('Page not found!');
  });
  
// Handle 404 errors
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).send(message);
});

const PORT = process.env.PORT || 3000;  // Fall back to 3000 if PORT isn't set
app.listen(PORT, () => {
  console.log(`Serving on port ${PORT}`);
});

