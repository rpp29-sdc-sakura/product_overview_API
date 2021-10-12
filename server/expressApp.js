const express = require('express');
const dbHelpers = require('./dbHelpers.js');
const { loaderIO } = require('../config.js');
const cleanCache  = require('./middleWare/cleanCache.js');
require('../database/mongo.js');

let app = express();

app.use(express.urlencoded({
    extended: true
  })
);

// Loader IO Route
app.get(`/${loaderIO}`, (req, res) => {
  res.status(200).send(loaderIO);
});

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
    dbHelpers.fetchProduct(productId)
    .then(result => {
      if (Array.isArray(result)) {
        res.status(204).send('Content with product id could not be found')
      } else {
        res.status(200).send(result);
      }
    });
  }
});

// Endpoint updates a the fully property value of a specified product
app.route('/products/:product_id').put(cleanCache, (req, res) => {
  let productId = parseInt(req.params['product_id']);
  if(isNaN(productId)) {
    res.status(400).send('Error: invalid product id provided');
  } else {
    dbHelpers.updateProduct(productId, req.body)
    .then(result => {
      if (result.acknowledged) {
        res.status(200).send('Product Updated');
      } else {
        res.status(400).send('Error: Product unsuccessfully updated');
      }
    });
  }
});

module.exports = app;