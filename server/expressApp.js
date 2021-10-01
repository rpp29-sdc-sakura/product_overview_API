const express = require('express');
const dbHelpers = require('./dbHelpers.js');
require('../database/mongo.js');

let app = express();

app.use(express.urlencoded({
    extended: true
  })
);

// Endpoint returns a page of products w/ basic product info
app.get('/products', (req, res) => {
  dbHelpers.fetchProducts(req.query)
  .then(result => {
    res.status(200).send(result);
  })
});

// Endpoint returns full product information of specified product (inc. features, styles, photos, skus)
app.get('/products/:product_id', (req, res) => {
  let productId = parseInt(req.params['product_id']);
  if(isNaN(productId)) {
    res.status(400).send('Error: invalid product id provided');
  } else {
    dbHelpers.fetchProductData(productId)
    .then(result => {
      if (Array.isArray(result)) {
        res.status(204).send('Content with product id could not be found')
      } else {
        res.status(200).send(result);
      }
    });
  }
});

module.exports = app;