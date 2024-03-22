const express = require('express');
const { getComments, addComment } = require('../controllers/comment.js');
const { authenticateJWT } = require('../middleware/auth.js');

const router = express.Router();

//router.use(authenticateJWT);

router.get("/", getComments);
router.post("/", addComment)

module.exports = router;