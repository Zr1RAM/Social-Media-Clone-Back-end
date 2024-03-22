const express = require('express');
const { getLikes, addLike, disLike } = require('../controllers/like.js');

const router = express.Router();

router.get("/", getLikes);
router.post("/", addLike);
router.delete("/", disLike);

module.exports = router;