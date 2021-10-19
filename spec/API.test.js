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

    it('should reject invalid inputs', async () => {
        const page = -1;
        const count = 9;

        res = await request(app)
        .get(`/products?page=${page}&count=${count}`);

        expect(res.statusCode).toEqual(400);
    });

    it('should return nothing for too high page input', async () => {
        const page = 100000000000;
        const count = 1;

        res = await request(app)
        .get(`/products?page=${page}&count=${count}`);

        expect(res.statusCode).toEqual(204);
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
    });

    it('should reject invalid ids', async () => {
        const productId1 = 'cat';
        const productId2 = -1;

        const res1 = await request(app)
        .get(`/products/${productId1}`);

        const res2 = await request(app)
        .get(`/products/${productId2}`);

        expect(res1.statusCode).toEqual(400);
        expect(res2.statusCode).toEqual(400);
    });

    it('should return nothing for non-existent but potentially valid ids', async () => {
        productId = 100000000000;

        res = await request(app)
        .get(`/products/${productId}`);

        expect(res.statusCode).toEqual(204);
    });
});

describe('PUT Request to /products/:productID Endpoint', () => {
    let res;
    let productId = 1;
    let original = { slogan: ''};
    let update = { slogan: 'newSlogan' };

    beforeAll(async () => {
        res = await request(app)
        .get(`/products/${productId}`);

        original.slogan = JSON.parse(res.text).slogan;

        res = await request(app)
        .put(`/products/${productId}`)
        .send(update)
        .type('form');
    });

    it('should update slogan', () => {
        expect(typeof res.body).toEqual('object');
        expect(res.body.slogan).toEqual(update.slogan);
    });

    it('should update data to original state', async () => {
        res = await request(app)
        .put(`/products/${productId}`)
        .send(original)
        .type('form');

        expect(res.body.slogan).toEqual(original.slogan);
    });

    it('should reject invalid and non-existant ids', async () => {
        const productId1 = 'cat';
        const productId2 = -1;
        const productId3 = 100000000000;

        const res1 = await request(app)
        .put(`/products/${productId1}`)
        .send(original)
        .type('form');

        const res2 = await request(app)
        .put(`/products/${productId2}`)
        .send(original)
        .type('form');

        const res3 = await request(app)
        .put(`/products/${productId3}`)
        .send(original)
        .type('form');

        expect(res1.statusCode).toEqual(400);
        expect(res2.statusCode).toEqual(400);
        expect(res3.statusCode).toEqual(400);
    });
});