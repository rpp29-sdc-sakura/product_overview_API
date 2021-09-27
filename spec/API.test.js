const app = require('../server/expressApp.js');
const request = require('supertest');



describe('GET Request to /products Endpoint', () => {
    let res;

    beforeAll(async () => {
        res = await request(app)
        .get('/products');
    });

    it('should return list of products', () => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.statusCode).toEqual(200);
    });

    it('should default to page 1 w/ count of 5 products', () => {
        expect(res.body[0].id).toEqual(1);
        expect(res.body.length).toEqual(5);
    })

    it('should accept query parameters and return correct page # and # of products', async () => {
        const page = 2;
        const count = 4;

        res = await request(app)
        .get(`/products?page=${page}&count=${count}`);

        expect(res.body[0].id).toEqual(5);
        expect(res.body.length).toEqual(4);
    });
});

describe('GET Request to /products/:productID Endpoint', () => {
    let res;
    let productId = 27;

    beforeAll(async () => {
        res = await request(app)
        .get(`/products/${productId}`);
    });

    it('should return a single product object with the provided id', () => {
        expect(typeof res.body).toEqual('object');
        expect(Array.isArray(res.body)).toBeFalsy();
        expect(res.body.id).toEqual(27);
    });

    it('should return product with correct number of associated features', () => {
        expect(res.body.features.length).toEqual(1);
    })
});

describe('GET Request to /products/:productID/styles Endpoint', () => {
    let res;
    let productId = 27;

    beforeAll(async () => {
        res = await request(app)
        .get(`/products/${productId}/styles`);
    });

    it('should return a single object with styles of specified product', () => {
        expect(typeof res.body).toEqual('object');
        expect(Array.isArray(res.body)).toBeFalsy();
        expect(res.body['product_id']).toEqual(27);
    });

    it('should return product with correct number of associated styles', () => {
        expect(res.body.results.length).toEqual(2);
    });

    it('should have the correct number of associated photos per style', () => {
        expect(res.body.results[0].photos.length).toEqual(3);
        expect(res.body.results[1].photos.length).toEqual(2);
    });

    it('should have the correct number of associated skus per style', () => {
        expect(Object.keys(res.body.results[0].skus).length).toEqual(6);
        expect(Object.keys(res.body.results[1].skus).length).toEqual(6);
    });
});