var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var Url = "mongodb://localhost:27017"
var port = 2000;
var app = express();
var cors = require('cors');
var dbs;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

MongoClient.connect(Url, function (err, conn) {
    var db1 = conn.db('angad');

    db1.collection("user").find({}).toArray().then((x) => { });
});

app.post('/userdata', function (req, res) {
    console.log(req.body);
    var rbody = req.body;
    rbody.date = new Date();
    console.log("qqqqq", rbody)
    MongoClient.connect(Url, (err, conn) => {
        var dbs = conn.db('angad');
        dbs.collection('user').save(rbody);
        var obj = { status: "success" };
        res.json(obj)
        res.end();
    })
}),

app.post('/users', function(req, res){
    console.log(req.body);  
    var rbody = req.body;
    var obj_ids = [];
    rbody.key.forEach(element => {
        obj_ids.push(ObjectId(element.item_id))
    });
    MongoClient.connect(Url, (err, conn)=>{
        var dbs = conn.db('angad');
        console.log(obj_ids);
        dbs.collection('user').find({_id: {$in: obj_ids}}).toArray( function(err,data){
            if (err) throw err;
            res.send(data)
        })
    })
})

    app.get('/getInfo', function (req, res) {
        console.log(req.body);
        MongoClient.connect(Url, (err, conn) => {
            var dbs = conn.db('angad');
            dbs.collection('user').find().count().then(function (numItems) {
                let result = dbs.collection("user").find().toArray(function (err, data) {
                    if (err) throw err;
                    console.log("send:",data);
                    res.send({ data: data, count: numItems });
                });
            })
        })
    })

app.get('/delete/:userid', function (req, res) {
    console.log('bbb', req.params.userid);
    MongoClient.connect(Url, function (err, conn) {
        if (err) throw err;
        dbs = conn.db('angad');
        dbs.collection("user").deleteOne({ "_id": ObjectId(req.params.userid) }, function (err, data) {
            if (err) throw err;
            console.log('deleted');
            res.send(data);
        })
    })

    app.get('/edit/:userid', function (req, res) {
        console.log('top');
        MongoClient.connect(Url, function (err, conn) {
            if (err) throw err;
            dbs = conn.db('angad');
            dbs.collection("user").updateOne({ "_id": ObjectId(req.params.userid) }, function (err, data) {
                if (err) throw err;
                console.log('edited');
                res.send(data);
            });
        })
    });
});

app.put('/updateData/:userid', function (req, res) {
    console.log('sss', req.body);
    MongoClient.connect(Url, function (err, conn) {
        if (err) throw err;
        dbs = conn.db('angad');
        var myquery = { "_id": ObjectId(req.params.userid) };
        var newvalues = { $set: { name: req.body.name, keys:req.body.keys, createdate: req.body.createdate, updatedate: req.body.updatedate} };
        dbs.collection("user").updateOne(myquery, newvalues, function (err, data) {
            if (err) throw err;
            console.log('updated');
            res.send(data);
            console.log("data :", data);
        })
    })
});

app.listen(port, function () {
    console.log("listen at :", +port);
})