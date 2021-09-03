const express = require('express');
const mongdb = require('../database/mongo.js');
const {models, productOverviewDB } = require('../database/postgres.js');

let app = express();

app.use(express.urlencoded({
    extended: true
  })
);



let port = 3000;

// app.listen( port, function() {
//   console.log(`listening on port ${port}`);
// });
productOverviewDB.sync().then(() => {
  app.listen( port, function() {
    console.log(`listening on port ${port}`);
  });
});

