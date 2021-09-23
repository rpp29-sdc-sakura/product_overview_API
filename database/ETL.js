const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const csvFolder = path.join(__dirname, '/../resources/csv');
const { models } = require('./postgres.js');

// Preserves correct order to add data to tables due to associations
let tables = ['products', 'features', 'styles', 'skus', 'photos'];

let tableData = {
    products: {
        path: path.join(csvFolder, 'products.csv'),
        modelName: 'Product'
    },
    features: {
        path: path.join(csvFolder, 'features.csv'),
        modelName: 'Feature'
    },
    styles: {
        path: path.join(csvFolder, 'styles.csv'),
        modelName: 'Style'
    },
    skus: {
        path: path.join(csvFolder, 'skus.csv'),
        modelName: 'SKU'
    },
    photos: {
        path: path.join(csvFolder, 'photos.csv'),
        modelName: 'Photo'
    }
}


// Function takes csv file, associates each col of data with the header for that col, creating an object for each row of data.
// Each row of data is added to an array which is then returned by the function once every row is read.
const collectData = (filePath) => {
    let fileName = path.basename(filePath, '.csv');
    let jsonArr = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', row => {
            if(fileName === 'styles') {
                if(row.sale_price === "null") delete row.sale_price;
                row["default_style"] === "1" ? row["default_style"] = true : row["default_style"] = false;
            }

            jsonArr.push(row);
        })
        .on('error', error => {
            reject(error);
        })
        .on('end', () => {
            resolve(jsonArr);
        });
    });
}

// Function takes data as array of object and bulkInserts batches of data into respective table
const insertInBatches = async (modelName, data, currentIndex, max) => {
    let batchSize = modelName === 'Photo' ? 10 : 2500;
    let end = currentIndex + batchSize > max ? max : currentIndex + batchSize;
    let batch = data.slice(currentIndex, end);
    console.log(models);
    console.log(models[modelName]);
    await models[modelName]
    .bulkCreate(batch, { updateOnDuplicate: ["id"] })
    .then(result => {
        console.log(result);
    })
    .catch(err => {
        console.log(err);
    })
    return end;
}


const main = () => {
    tables.forEach(table => {
        let modelName = tableData[table].modelName;
        let filePath = tableData[table].path;

        collectData(filePath)
        .then(async data => {
            let currentIndex = 0;
            while (currentIndex < data.length) {
                currentIndex =  await insertInBatches(modelName, data, currentIndex, data.length);
            }

            console.log('Data all inserted');
        });
    });
}


main();