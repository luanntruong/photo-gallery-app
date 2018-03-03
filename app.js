var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    expressSanitizer    = require("express-sanitizer"),
    methodOverride      = require("method-override"),
    mongoose            = require("mongoose"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    flash               = require("connect-flash"),
    User                = require("./models/user"),
    Photo                = require("./models/photo"),
    photoRoutes          = require("./routes/photos"),
    indexRoutes         = require("./routes/index");

// DATABASE CONFIG
mongoose.Promise = global.Promise;

const databaseUri = process.env.DATABASEURL || 'mongodb://localhost:/photos_app';

mongoose.connect(databaseUri)
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));


// APP CONFIG
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//  SET RES.LOCALS VAR
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
 });
 
 // ROUTES CONFIG
app.use("/", indexRoutes);
app.use("/", photoRoutes);

// PORT LISTEN CONFIG
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is running!");
});