const   methodOverride = require("method-override"),
        express        = require("express"),
        app            = express(),
        bodyParser     = require("body-parser"),
        mongoose       = require("mongoose"),
        passport       = require("passport"),
        seedDB         = require("./seeds"),
        flash          = require("connect-flash"),
        // PORT           = 3000,
        User           = require("./models/user"),
        Garden         = require("./models/garden"),
        Plant          = require("./models/plant"),
        Note           = require("./models/note"),
        LocalStrategy  = require("passport-local");

const   gardenRoutes    = require("./routes/gardens"),
        plantRoutes     = require("./routes/plants"),
        noteRoutes      = require("./routes/notes"),
        indexRoutes     = require("./routes/index");

mongoose.connect("mongodb://baxter:lonnie@ds215910.mlab.com:15910/seedscribe");
// mongodb://localhost/seed_scribe
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
//seedDB();
app.use(flash());

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "It is not the fault of Mongo",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// help with navbar username indicator and flash messages
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/gardens", gardenRoutes);
app.use("/gardens/:id/plants", plantRoutes);
app.use("/gardens/:id/plants/:plant_id", noteRoutes);



// SERVER LISTENER
app.listen(process.env.PORT, process.env.IP);
// app.listen(PORT, () => {
//     console.log("Server listening on port " + PORT + "...");
// });