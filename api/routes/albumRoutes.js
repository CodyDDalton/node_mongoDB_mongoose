const express = require("express");
const mongoose= require("mongoose");
const router = express.Router();
const Album = require("../models/album");
const Messages = require("../messages/messages");

//get album
router.get('/', (req, res) => {
    Album.find()
        .select("title artist _id")
        .exec()                                 
        .then(albums => 
            res.json(albums));
        });
        

//post album
router.post("/", (req, res, next) => {

    Album.find({ 
        title: req.body.title, 
        artist: req.body.artist 
    })
    .exec()
    .then(result => {
        console.log(result);
        if(result.length > 0){
            return res.status(200).json({
                message: Messages.album_already_cataloged,
            })
        }
        else{
            const newAlbum = new Album({
                _id:mongoose.Types.ObjectId(),
                title:req.body.title,
                artist:req.body.artist,
            });
            
            newAlbum.save()
                .then(result => {
                    console.log(result);
                    res.status(200).json({
                        message: Messages.album_added,
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
        }
    })
    .catch(err =>{
            console.error(err.message);
            res.status(500).json({
                error:{
                    message: Messages.unable_to_add_album,
                }
            })
        })
});

//get album by id
router.get("/:albumId", (req, res, next) => {
    const albumId = req.params.albumId;
    Album.findById(albumId)
        .select("title artist _id")
        .exec()
        .then(album => {
            res.status(200).json({
                message: Messages.got_album_id,
                album: { album,
                metadata:{
                    method: req.method,
                    host: req.hostname
                }
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
            message: Messages.album_update,
            album: {title: req.body.title, artist: req.body.artist,
                metadata:{
                    host:req.hostname,
                    method:req.method,
                }
            },
        })
    })
    .catch(err => {
        res.status(500).json({
            error:{
                message: err.message,
            }
        });
    });
});

router.delete("/:albumId", (req, res, next) => {
    const albumId = req.params.albumId;
   
    Album.findByIdAndRemove(albumId)
        .then(result => {
            res.status(202).json({
                message: Messages.album_deleted,
                album:{
                    title:result.title,
                    artist:result.artist,
                metadata:{
                    host:req.hostname,
                    method:req.method,
                }
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