const express = require("express");
const mongoose= require("mongoose");
const router = express.Router();
const Artist = require("../models/artist");
const Messages = require("../messages/messages");

//get artist
router.get('/', (req, res) => {
    Artist.find()
        .select("name _id")
        .populate("album", "title artist")
        .exec()
        .then(artists => res.json(artists))
  });

//post artist
router.post("/", (req, res, next) => {

    Artist.find({ 
        album: req.body.album, 
        name: req.body.name 
    })
    .exec()
    .then(result => {
        console.log(result);
        if(result.length > 0){
            return res.status(200).json({
                message: Messages.artist_already_cataloged,
            })
        }
        else{
            const newArtist = new Artist({
                _id:mongoose.Types.ObjectId(),
                album:req.body.album,
                name:req.body.name,
            });
            
            newArtist.save()
                .then(result => {
                    console.log(result);
                    res.status(200).json({
                        message: Messages.artist_added,
                        artist:{
                            id:result._id,
                            name:result.name,
                        album: {
                            album_id: result.album,
                        },
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
                    message: Messages.unable_to_add_artist,
                }
            })
        })
});

//get album by id
router.get("/:artistId", (req, res, next) => {
    const artistId = req.params.artistId;
    Artist.findById(artistId)
    .select("name _id")
    .populate("album", "title artist")
    .exec()
        .then(artist => {
            console.log(artist);
            res.status(200).json({
                message: Messages.got_artist_id,
                artist: {
                    artist,
                metadata:{
                    method:req.method,
                    host:req.hostname
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
router.patch("/:artistId", (req, res, next) => {
    const artistId = req.params.artistId;
    
    const updatedArtist = {
        album: req.body.album,
        name: req.body.name
    };

    Artist.findByIdAndUpdate(artistId, { $set: { album: updatedArtist.album, name: updatedArtist.name }})
    .then(result => {
        res.status(200).json({
            message: Messages.artist_update,
            artist: {album: req.body.album, name: req.body.name, _id: req.body._id,
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
        });
    });
});

router.delete("/:artistId", (req, res, next) => {
    const artistId = req.params.artistId;
   
    Artist.findByIdAndRemove(artistId)
        .then(result => {
            res.status(202).json({
                message: Messages.artist_deleted,
                artist: {
                    name: result.name,
                    _id: result._id,
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