const express = require("express");
const mongoose= require("mongoose");
const router = express.Router();
const Album = require("../models/album");

//get album
router.get("/", (req, res, next) => {
    mongoose.get("/", () => {
        res.status(200).json({
            message:"Connected to album database!"
        })
    })
});

//post album
router.post("/", (req, res, next) => {
    const newAlbum = new Album({
        _id:mongoose.Types.ObjectId(),
        title:req.body.title,
        artist:req.body.artist,
    });

    //write to database
    newAlbum.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message:"Album added!",
                album:{
                    title:result.title,
                    artist:result.artist,
                    id:result._id,
                    metadata:{
                        method:req.method,
                        host:req.hostname,
                    }
                }
            })
        })
        .catch(err =>{
            console.error(err.message);
            res.status(500).json({
                error:{
                    message:err.message,
                }
            })
        })
});

//get album by id
router.get("/:albumId", (req, res, next) => {
    const albumId = req.params.albumId;
    Album.findById(albumId)
        .then(result => {
            res.status(200).json({
                message: "Found album by ID!",
                album: { title: result.title, artist: result.artist, id: result._id },
                metadata:{
                    host:req.hostname,
                    method:req.method,
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error:{
                    message: err.message,
                }
            })
        });
});

//patch wasn't working for me with the method shown, so I found the findByIdAndUpdate method Mongoose docs
router.patch("/:albumId", (req, res, next) => {
    const albumId = req.params.albumId;
    
    const updatedAlbum = {
        title: req.body.title,
        artist: req.body.artist
    };

    Album.findByIdAndUpdate(albumId, { $set: { title: updatedAlbum.title, artist: updatedAlbum.artist }})
    .then(result => {
        res.status(200).json({
            message: "Updated album!",
            album: {title: result.title, artist: result.artist, _id: result._id,
            },
            metadata:{
                host:req.hostname,
                method:req.method,
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error:{
                message: err.message,
            }
        })
    });
});

router.delete("/:albumId", (req, res, next) => {
    const albumId = req.params.albumId;
   
    Album.findByIdAndRemove(albumId)
        .then(result => {
            res.status(200).json({
                message: "Album has been deleted!",
                metadata:{
                    host:req.hostname,
                    method:req.method,
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error:{
                    message: err.message,
                }
            })
        });
});

module.exports = router;