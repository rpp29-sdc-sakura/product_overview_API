const express = require('express');
const dbHelpers = require('./middleWare/dbHelpers.js');
const cleanCache  = require('./middleWare/cleanCache.js');
const { queryParamValidator, productIDValidator } = require('./middleWare/validation');
require('../database/mongo.js');

let app = express();

app.use(express.urlencoded({
    extended: true
  })
);

// Endpoint returns a page of products w/ basic product info
app.get('/products', async (req, res) => {
  const queryParams = req.query; 
  if (queryParamValidator(queryParams)) {
    await dbHelpers.fetchProducts(queryParams)
    .then(result => {
      result.length > 0 ? res.status(200).send(result) : res.status(204).send();
    });
  } else {
    res.status(400).send(`
    Error: Invalid query parameters provided:
    - Page must be a number greater than zero.
    - Count must be a number greater than zero but no greater than 100,000.`);
  }
});

// Endpoint returns full product information of specified product (inc. features, styles, photos, skus)
app.get('/products/:product_id', async (req, res) => {
  if (productIDValidator(req.params['product_id'])) {
    const productId = parseInt(req.params['product_id']);
    await dbHelpers.fetchProduct(productId)
    .then(result => {
      if (Array.isArray(result)) {
        res.status(204).send();
      } else {
        res.status(200).send(result);
      }
    });
  } else {
    res.status(400).send(`
    Error: Invalid product id provided:
    - ID must be a number greater than one.`);
  }
});

// Endpoint updates property value of a specified product
app.put('/products/:product_id', async (req, res) => {
  if (productIDValidator(req.params['product_id']) && Object.keys(req.body).length > 0) {
    const productId = parseInt(req.params['product_id']);
    await dbHelpers.updateProduct(productId, req.body)
    .then(result => {
      if (result) {
        cleanCache(productId);
        res.status(200).send(result);
      } else {
        res.status(400).send(`
        Error: Product unsuccessfully updated:
        - ID does not exist.`);
      }
    });
  } else {
    res.status(400).send(`
      Error: Product unsuccessfully updated:
      - ID must be a number greater than one
      - Request body must contain at least one product propery name as key with value being the data to be updated.`);
  }
});

module.exports = app;