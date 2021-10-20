# Product Overview REST API Service
## Overview
This is a **REST**ful API built to supply *product* data to a client/front-end. This service manages the data for the **Product Overview** section, working in tandem with additional services that manage data for the **Related Products**, **Questions & Answers**, and **Reviews** sections.

## Install
To install application dependancies

```
npm install
```

## Test
* [Jest](https://jestjs.io/) Testing of API Endpoints w/ [SuperTest](https://github.com/visionmedia/supertest) `npm test`
  * Testing suite located at `spec/API.test.js`

* Development Load Testing w/ [K6](https://k6.io/docs/)
  1. Enter `spec/` folder
  2. Configure load testing suite in `loadTest.js` file
  3. To run, type `k6 run loadTest.js` in terminal

## Usage
### Get a List of Products
#### Request
```
GET /products?count=#&page=#
```
This request has two optional query parameters `count` and `page`. 
* `count`
  * Specifies the number of products to return
  * Must be a number greater than `0` but no greater than `100,000`.
  * Defaults to a count of `5` if not specified
* `page`
  * Specifies the page number of products to return.\
   ex. page `2` with a count of `5` will return IDs `6 - 10`
  * Must be a number greater than `0`.
  * Defaults to page `1` if not specified

#### Response
``` json
status: 200 OK

[
    {
        "id": 1,
        "name": "Camo Onesie",
        "slogan": "Blend in to your crowd",
        "description": "The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.",
        "category": "Jackets",
        "default_price": 150
    },
    {
        "id": 2,
        "name": "Bright Future Sunglasses",
        "slogan": "You've got to wear shades",
        "description": "Where you're going you might not need roads, but you definitely need some shades. Give those baby blues a rest and let the future shine bright on these timeless lenses.",
        "category": "Accessories",
        "default_price": 69
    },
    {
        "id": 3,
        "name": "Morning Joggers",
        "slogan": "Make yourself a morning person",
        "description": "Whether you're a morning person or not.  Whether you're gym bound or not.  Everyone looks good in joggers.",
        "category": "Pants",
        "default_price": 40
    },
    ...
]

```
### Get a Single Product
#### Request
```
GET /products/:productId
```
This request takes a specific product ID
* The product ID must be a number greater than `0` and a product with that ID must exist 
#### Response
``` json
status: 200 OK

{
    "id": 1,
    "name": "Camo Onesie",
    "slogan": "Blend in to your crowd",
    "description": "The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.",
    "category": "Jackets",
    "default_price": 150,
    "features": [
        {
            "feature": "Fabric",
            "value": "Canvas"
        },
        {
            "feature": "Buttons",
            "value": "Brass"
        }
    ],
    "styles": [
        {
            "style_id": 1,
            "name": "Forest Green & Black",
            "original_price": 140,
            "sale_price": null,
            "default?": true,
            "photos": [
                {
                    "thumbnail_url": "https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80",
                    "url": "https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"
                },
                ...
            ],
            "skus": {
                "1": {
                    "quantity": "8",
                    "size": "XS"
                },
                "2": {
                    "quantity": "16",
                    "size": "S"
                },
                ...
            }
         },
         ...
    ]
}
```
### Update a Single Product
#### Request
```
PUT /products/:productId
```
This request takes a specific product ID and a non-optional update object sent in the request body.
* The product ID must be a number greater than `0` and a product with that ID must exist
* The update object must include one or more keys that match to properties existing in a product object. The values associated with these keys will be the data that is intended to replace the data that exists in the database. 

``` json
updateObject = {
  'slogan': 'new slogan',
  'default_price': 99
}
```
#### Response
``` json
status: 200 OK

{
    "id": 1,
    "name": "Camo Onesie",
    "slogan": "new slogan",
    "description": "The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.",
    "category": "Jackets",
    "default_price": 99,
    "features": [
        {
            "feature": "Fabric",
            "value": "Canvas"
        },
        {
            "feature": "Buttons",
            "value": "Brass"
        }
    ],
    "styles": [
        {
            "style_id": 1,
            "name": "Forest Green & Black",
            "original_price": 140,
            "sale_price": null,
            "default?": true,
            "photos": [
                {
                    "thumbnail_url": "https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80",
                    "url": "https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"
                },
                ...
            ],
            "skus": {
                "1": {
                    "quantity": "8",
                    "size": "XS"
                },
                "2": {
                    "quantity": "16",
                    "size": "S"
                },
                ...
            }
         },
         ...
    ]
}
```

