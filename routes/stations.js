let express = require('express')
let router = express.Router()
let mongoose = require('mongoose')
mongoose.connect('mongodb://admin:admin123451@ds137763.mlab.com:37763/bkid', (err) => {
    if(err) console.error(err)
    else console.log("Station router connects successfully to mLab")
})

//SCHEMAS
let stationAccountSchema = new mongoose.Schema({
    username: String,
    password: String,
    stationID: String,
})

//MODELS
let Station = mongoose.model('Station', stationAccountSchema)

//GET station list
router.get('/', (req, res, next) => {
    Station.find({}, (err, stations) => {
        if(err)
        {
            console.error(err)
            res.send("Something went wrong")
        }
        else
        {
            res.send(stations)
        }
    })
})

//DELETE all stations
router.delete('/', (req, res, next) => {
    Station.deleteMany({}, (err, stations) => {
        if(err)
        {
            console.error(err)
            res.send("Something went wrong")
        }
        else
        {
            res.send("Delete complete")
        }
    })
})

//CREATE new station
router.post('/', (req, res, next) => {
    let station = new Station({
        username: req.body.username,
        password: req.body.password,
        stationID: req.body.stationID
    })
    station.save((err) => {
        if(err)
        {
            console.error(err)
            res.send("Something went wrong")
        }
        else
        {
            res.send("Complete")
            console.log(`Station ${station.stationID} has been created`)
        }
    })
})

//LOGIN

router.post('/login', (req, res, next) => {
    Station.find({username: req.body.username, password: req.body.password}, (err, stations) => {
        if(err)
        {
            console.error(err)
            res.send("Something went wrong")
        }
        else
        {
            if(stations.length != 0)
            {
                res.send(stations[0])
            }
            else
            {
                res.send("Wrong username or password")
            }
        }
    })
})

module.exports = router;