const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const multer = require("multer");
const userRouter = require('./routers/userRoutes');
const dbsConnection = require('./connection/dbsConnection');
const app = express()
var upload = multer();
const port = 3000;



// Body-parser middleware 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(upload.any());

var dir = path.join(__dirname, 'assets');
app.use(express.static(dir));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});


app.use('/api/1.0.0/users', userRouter);



dbsConnection.connectToServer( function( err, client ) {
  if (err) { console.log(err) }
  else {    
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  }
});