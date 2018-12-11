var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin123451@ds137763.mlab.com:37763/bkid', (err) => {
  if (err) 
  console.error(err);
  else console.log("User router connects successfully to mLab")
})

//SCHEMAS
let studentSchema = new mongoose.Schema({
  name: String,
  studentID: String,
  UID: String,
  admin: Boolean,
  accessIn: Boolean,
  accessHistory: [{
    roomID: String,
    accessIn: Boolean,
    accessTime: Number
  }]
})

//MODELS
let Student = mongoose.model('Student', studentSchema);

/* GET students listing. */
router.get('/', function(req, res, next) {
  Student.find({}, function(err, users){
    if(err)
    {
      console.error(err)
      res.send("Something went wrong")
    }
    else{
      res.send(users)
    }
  })
});

//GET A STUDENT WITH GIVEN UID
router.get('/:uid', function(req, res, next) {
  Student.findOne({UID: req.params.uid}, function(err, users){
    if(err)
    {
      console.error(err)
      res.send("Something went wrong")
    }
    else{
      res.send(users)
    }
  })
});

//DELETE ALL STUDENTS
router.delete('/', function(req, res, next) {
  Student.deleteMany({}, function(err, users){
    if(err)
    {
      console.error(err)
      res.send("Something went wrong")
    }
    else
    {
      res.send("Complete")
    }
  })
})

//DELETE A STUDENT WITH GIVEN UID
router.post('/delete', function(req, res, next) {
  Student.deleteOne({UID: req.body.UID}, function(err, users){
    if(err)
    {
      let response = {
        delete : false
      }
      console.log(err)
      res.send(response)
    }
    else
    {
      let response = {
        delete: true
      }
      res.send(response)
    }
  })
})
//UPDATE STUDENT INFO
router.post('/update', function(req, res, next) {
  console.log(req.body)
  Student.findOneAndUpdate(
    {UID: req.body.UID},
    {name: req.body.name, studentID : req.body.studentID}, 
    {upsert : true},
    function(err, users) {
      console.log(users)
      
      if(err)
      {
        let response = {
          update: false
        }
        console.error(err);
        res.send(response)
      }
      else
      {
        let response = {
          update: true
        }
        res.send(response)
      }
    }
  )
})

// GET UID AND TIME FROM READER

router.get('/auth/uid/:uid/time/:time/room/:room', (req, res, next) => {
  Student.find({UID: req.params.uid}, function(err, users){
    if(err)
    {
      console.error(err)
      res.send("Something went wrong")
    }
    console.log(req.params.uid)
    let access = true
    let accessIn = true
    console.log(users)
    if(users.length == 0)
    {
      let result = {
        admin: false,
        access: false,
        accessIn: true,
      }
      res.send(result)
    }
    else
    {
      if(users[0].admin)
      {
        let response = {
          admin: true,
          access: true,
          accessIn: true,
        }
        res.send(response)
      }
      else{
        access = true
        let history = users[0].accessHistory;
        let record;
        if(history.length != 0)
        {
          record = {
            roomID : req.params.room,
            accessIn : !history[history.length-1].accessIn,
            accessTime : req.params.time
          }
        }
        else{
          record = {
            roomID : req.params.room,
            accessIn : true,
            accessTime : req.params.time
          }
        }
        accessIn = record.accessIn
        history.push(record)
        console.log(history)
        Student.findOneAndUpdate(
          {UID: req.params.uid}, 
          {accessIn: record.accessIn, accessHistory : history}, 
          {upsert : true},
          function(err, users) {
            if(err)
            {
              console.error(err);
            }
          }
        )
        let result = {
          admin: false,
          access: access,
          accessIn: accessIn,
        }
        res.send(result)
      }
    }
  })
})

// CREATE NEW STUDENT

router.post('/', (req, res, next) => {
  let student = new Student({
    name: req.body.name,
    studentID: req.body.studentID,
    UID: req.body.UID,
    admin: false,
    accessIn: true,
  })
  student.save(function(err){
    if(err) 
    {
      let response = {
        insert: false,
      }
      console.error(err)
      res.send(response)
    }
    else{
      let response = {
        insert: true,
      }
      res.send(response)
      console.log("A student has been created")
    }
  })
})

//CREATE BLANK STUDENT
router.get('/create/:uid', (req, res, next) => {
  let student = new Student({
    name: "",
    studentID: "",
    UID: req.params.uid,
    admin: false,
    accessIn: true,
  })
  student.save(function(err){
    if(err) 
    {
      let response = {
        insert: false,
      }
      console.error(err)
      res.send(response)
    }
    else{
      let response = {
        insert: true,
      }
      res.send(response)
      console.log("A student has been created")
    }
  })
})

module.exports = router;
