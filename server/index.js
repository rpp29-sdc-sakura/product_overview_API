const express = require('express');
let app = express();

app.use(express.urlencoded({
    extended: true
  })
);



let port = 3000;

app.listen( port, function() {
  console.log(`listening on port ${port}`);
});

