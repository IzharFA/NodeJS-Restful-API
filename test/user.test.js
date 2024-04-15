import supertest from "supertest";
import {web} from "../src/app/web.js";
import {logger} from "../src/app/logging.js";
import {createTestUser, getTestUser, removeTestUser} from "./test-util.js";
import bcrypt from "bcrypt";

describe('POST /api/users', function () {

    afterEach(async () => {
        await removeTestUser();
    })

    test('should can register new user', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                ID: 9699,
                NIK: 21221,
                name: 'Izanami'
            });

        expect(result.status).toBe(200);
        expect(result.body.data.ID).toBe(9699);
        expect(result.body.data.name).toBe("Izanami");
        expect(result.body.data.NIK).toBeUndefined();
    });

    it('should reject if request is invalid', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                ID: '',
                NIK: '',
                name: ''
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if ID already registered', async () => {
        let result = await supertest(web)
            .post('/api/users')
            .send({
                ID: 9699,
                NIK: 21221,
                name: 'Izanami'
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.ID).toBe(9699);
        expect(result.body.data.name).toBe("Izanami");
        expect(result.body.data.NIK).toBeUndefined();

        result = await supertest(web)
            .post('/api/users')
            .send({
                ID: 9699,
                NIK: 21221,
                name: 'Izanami'
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe('POST /api/users/login', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can login', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                ID: 9699,
                NIK: 21221
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.token).toBeDefined();
        expect(result.body.data.token).not.toBe("test");
    });

    it('should reject login if request is invalid', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                ID: "",
                NIK: ""
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject login if NIK is wrong', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                ID: 9699,
                NIK: "salah"
            });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject login if ID is wrong', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                ID: "salah",
                NIK: "salah"
            });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/users/current', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can get current user', async () => {
        const result = await supertest(web)
            .get('/api/users/current')
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.ID).toBe('test');
        expect(result.body.data.name).toBe('test');
    });

    it('should reject if token is invalid', async () => {
        const result = await supertest(web)
            .get('/api/users/current')
            .set('Authorization', 'salah');

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe('PATCH /api/users/current', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can update user', async () => {
        const result = await supertest(web)
            .patch("/api/users/current")
            .set("Authorization", "test")
            .send({
                name: "Izanami",
                NIK: 321321
            });

        expect(result.status).toBe(200);
        expect(result.body.data.ID).toBe('test');
        expect(result.body.data.name).toBe("Izanami");

        const user = await getTestUser();
        expect(await bcrypt.compare("321321", user.NIK)).toBe(true);
    });

    it('should can update user name', async () => {
        const result = await supertest(web)
            .patch("/api/users/current")
            .set("Authorization", "test")
            .send({
                name: "Izanami"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.ID).toBe('test');
        expect(result.body.data.name).toBe("Izanami");
    });

    it('should can update user password', async () => {
        const result = await supertest(web)
            .patch("/api/users/current")
            .set("Authorization", "test")
            .send({
                password: 321312
            });

        expect(result.status).toBe(200);
        expect(result.body.data.ID).toBe('test');
        expect(result.body.data.name).toBe("Izanami");

        const user = await getTestUser();
        expect(await bcrypt.compare(321321, user.NIK)).toBe(true);
    });

    it('should reject if request is not valid', async () => {
        const result = await supertest(web)
            .patch("/api/users/current")
            .set("Authorization", "salah")
            .send({});

        expect(result.status).toBe(401);
    });
});

describe('DELETE /api/users/logout', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can logout', async () => {
        const result = await supertest(web)
            .delete('/api/users/logout')
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data).toBe("OK");

        const user = await getTestUser();
        expect(user.token).toBeNull();
    });

    it('should reject logout if token is invalid', async () => {
        const result = await supertest(web)
            .delete('/api/users/logout')
            .set('Authorization', 'salah');

        expect(result.status).toBe(401);
    });
});
