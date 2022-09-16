const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    res.json({ message:"Authors - Get"});
});

router.post("/", (req, res, next) => {
    res.json({ message:"Authors - Post"});
});

router.get("/:authorId", (req, res, next) => {
    const authorId = req.params.authorId;
    res.json({ 
        message:"Authors - Get by Id",
        id:authorId,
    });
});

router.patch("/:authorId", (req, res, next) => {
    const authorId = req.params.authorId;
    res.json({ 
        message:"Authors - Patch",
        id:authorId,
    });
});

router.delete("/:authorId", (req, res, next) => {
    const authorId = req.params.authorId;
    res.json({ 
        message:"Authors - Delete",
        id:authorId,
    });
});

module.exports = router;