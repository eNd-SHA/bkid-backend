let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin123451@ds137763.mlab.com:37763/bkid', (err) => {
  if (err) 
  console.error(err);
  else console.log("Room router connects successfully to mLab")
})

//SCHEMAS
let roomSchema = new mongoose.Schema({
    roomID: String,
    timeIn: Number,
    timeOut: Number,
    students: [{
      name: String,
      studentID: String,
      UID: String
    }]
  })

//MODELS
let Room = mongoose.model('Room', roomSchema);

//GET Room list
router.get('/', function(req, res, next) {
    Room.find({}, function(err, rooms) {
        if(err)
        {
            res.send("Something went wrong")
            console.log(err)
        }
        else{
            res.send(rooms)
        }
    })
})

//DELETE all rooms
router.delete('/', function(req, res, next) {
    Room.deleteMany({}, function(err, rooms){
        if(err)
        {
            res.send("Something went wrong")
            console.error(err)
        }
        else{
            res.send("Delete complete")
        }
    })
})

//CREATE new room
router.post('/', function(req, res, next){
    let room = new Room({
        roomID: req.body.roomID,
        timeIn: req.body.timeIn,
        timeOut: req.body.timeOut,
    })
    room.save(function(err){
        if(err)
        {
            console.error(err)
            res.send("Fail")
        }
        else
        {
            res.send("Complete")
            console.log(`Room ${room.roomID} has been created`)
        }
    })
})



module.exports = router;