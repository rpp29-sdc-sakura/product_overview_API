const express = require('express');

let port = 3000;
let app = express();

app.use(express.urlencoded({
    extended: true
  })
);










app.listen( port, function() {
  console.log(`listening on port ${port}`);
});