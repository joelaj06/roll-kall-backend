const express = require("express");
const { helloWord } = require("../controllers/hello_wold");

const router = express.Router();

router.get("/", helloWord);

module.exports = router;
