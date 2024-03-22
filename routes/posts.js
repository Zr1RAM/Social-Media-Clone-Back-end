const express = require('express');
const { getPosts, addPost, handleSingleFileUpload, getPostAt } = require('../controllers/post.js');
const { authenticateJWT } = require('../middleware/auth.js');
const { singleFileUpload } = require('../middleware/multer.js');

const router = express.Router();

//router.use(authenticateJWT);

router.get("/", getPosts);
router.get("/:postId", getPostAt);
router.post("/", addPost);
router.post('/upload', singleFileUpload, handleSingleFileUpload);

module.exports = router;