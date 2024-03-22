const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

const authRoutes = require("./routes/auth.js");
const commentsRoutes = require("./routes/comments.js");
const likesRoutes = require("./routes/likes.js");
const postsRoutes = require("./routes/posts.js");
const userRoutes = require("./routes/users.js");
const cookieParser = require('cookie-parser');
const { authenticateJWT, authorizeUser } = require('./middleware/auth.js');

// middlewares
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: "http://127.0.0.1:5173"
}));
app.use(cookieParser());

app.get("/", (req, res) => {
    console.log('sample get request works');
    res.status(200).json("connected");
})





app.use("/api/auth", authRoutes);

app.use(authenticateJWT);

app.use("/api/comments", commentsRoutes);
app.use("/api/likes", likesRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/users", userRoutes);

app.use('/uploads', authorizeUser, express.static(path.join(__dirname, 'uploads')));

app.listen(8800, () => {
    console.log("API working!");
})