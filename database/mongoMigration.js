const { fetchProductData } = require('../server/dbHelpers.js');
const Product = require('./mongo.js');
//const { productOverviewDB, models } = require('../database/postgres.js');
let maxProductId = 1000011;


const collectProductData = async id => {
    let product = await fetchProductData(id);
    return product;
}

const createBatch = async (startId, endId) => {
    let batch = [];
    for (let i = startId; i < endId; i++) {
        await collectProductData(i)
        .then(product => {
            batch.push(product);
        })
    }
    return batch;
}

const addProductsToMongo = async (increment, maxId) => {
    let startId = 1;
    let endId = increment;
    while(endId <= maxId) {
        await createBatch(startId, endId)
        .then(async batch => {
            await Product.create(batch)
            .then(result => console.log(result));
        })
        startId = endId;
        if(endId === maxId){
            endId = maxId + 1;
        } else {
            endId = endId + increment > maxId ? maxId : endId + increment;
        }
    }
    console.log('DB Seeded');
}

//addProductsToMongo(200, maxProductId);