const express = require('express');
const dbHelpers = require('./dbHelpers.js');

let port = 3000;
let app = express();

app.use(express.urlencoded({
    extended: true
  })
);

app.get('/products', (req, res) => {
  dbHelpers.fetchProducts(req.query)
  .then(result => {
    res.status(200).send(result);
  })
});

app.get('/products/:product_id', (req, res) => {
  let productId = parseInt(req.params['product_id']);
  if(isNaN(productId)) {
    res.status(400).send('Invalid product ID');
  } else {
    dbHelpers.fetchProduct(productId)
    .then(result => {
      res.status(200).send(result);
    });
  }
});








app.listen( port, function() {
  console.log(`listening on port ${port}`);
});