const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const request = require('supertest')
const LearningContent = require('../../models/LearningContent')
const { app } = require('../../app')

jest.mock("../../../packages/config/redisClientConfig", () => ({
    get: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
}));

let server
beforeAll(async () => {
    server = await MongoMemoryServer.create()
    let uri = server.getUri()
    await mongoose.connect(uri)
})

afterAll(async () => {
    await mongoose.disconnect()
    await server.stop()
})

afterEach(async () => {
    await LearningContent.deleteMany()
})


// --------------------- ADD SINGLE ---------------------
describe("POST/apis/learning-content", () => {
    it("create and save successfully", async () => {

        const content = {
            main_topic: "supervised",
            sub_topic: "regression",
            title: "Linear Regression",
            description: "Intro to linear regression",
            main_content: "Detailed content here...",
            video_links: ["https://youtube.com/example"],
            examples: [{ text: "House price prediction", link: "https://example.com" }],
        };

        const response = await request(app)
            .post("/apis/learning-content")
            .send(content)

        expect(response.body.success).toBe(true)
        expect(response.statusCode).toBe(201)
        expect(response.body.learningContent).toBeDefined()
        expect(response.body.learningContent.title).toBe("Linear Regression")

    })

    it("dont save when required field(s) are missing", async () => {

        const content = {
            sub_topic: "regression",
            title: "Linear Regression",
            description: "Intro to linear regression",
            main_content: "Detailed content here...",
            video_links: ["https://youtube.com/example"],
            examples: [{ text: "House price prediction", link: "https://example.com" }],
        };

        const response = await request(app)
            .post("/apis/learning-content")
            .send(content)

        expect(response.body.success).toBe(false)

    })
})


// --------------------- BULK ADD ---------------------
describe("POST/apis/learning-content/bulk", () => {
    it("create and save successfully", async () => {

        const contentList = [{
            main_topic: "supervised",
            sub_topic: "regression",
            title: "Linear Regression",
            description: "Intro to linear regression",
            main_content: "Detailed content here...",
            video_links: ["https://youtube.com/example"],
            examples: [{ text: "House price prediction", link: "https://example.com" }],
        }, {
            main_topic: "supervised",
            sub_topic: "regression",
            title: "Polynomial Regression",
            description: "Intro to polynomial regression",
            main_content: "Detailed content here...",
            video_links: ["https://youtube.com/example"],
            examples: [{ text: "House price prediction", link: "https://example.com" }],
        }];

        const response = await request(app)
            .post("/apis/learning-content/bulk")
            .send(contentList)

        expect(response.body.success).toBe(true)
        expect(response.statusCode).toBe(201)
        expect(response.body.contentList.length).toBe(2)
        expect(response.body.contentList[0].title).toBe("Linear Regression")

    })

    it("dont save when required field(s) are missing", async () => {

        const content = [{
            sub_topic: "regression",
            title: "Linear Regression",
            description: "Intro to linear regression",
            main_content: "Detailed content here...",
            video_links: ["https://youtube.com/example"],
            examples: [{ text: "House price prediction", link: "https://example.com" }],
        }];

        const response = await request(app)
            .post("/apis/learning-content/bulk")
            .send(content)

        expect(response.body.success).toBe(false)

    })
})

// --------------------- GET SINGLE ---------------------
describe("GET /apis/learning-content/:id", () => {
    it("should fetch content by ID", async () => {
        const content = new LearningContent({
            main_topic: "supervised",
            sub_topic: "regression",
            title: "Linear Regression",
            description: "Intro to linear regression",
            main_content: "Content here",
            video_links: ["https://youtube.com/example"],
            examples: [{ text: "House price prediction", link: "https://example.com" }],
        })
        const saved = await content.save()

        const res = await request(app)
            .get(`/apis/learning-content/${saved._id}`)
            .expect(200)

        expect(res.body.success).toBe(true)
        expect(res.body.learningContent.title).toBe("Linear Regression")
    })

    it("should return 404 for invalid ID", async () => {
        const invalidId = new mongoose.Types.ObjectId()
        const res = await request(app)
            .get(`/apis/learning-content/${invalidId}`)
        expect(res.body.success).toBe(false)
        expect(res.statusCode).toBe(404)
    })
})

// --------------------- GET ALL ---------------------
describe("GET /apis/learning-content", () => {
    it("should fetch all content", async () => {
        await LearningContent.create([
            { main_topic: "supervised", sub_topic: "regression", title: "LR", description: "desc", main_content: "content" },
            { main_topic: "supervised", sub_topic: "classification", title: "Logistic", description: "desc", main_content: "content" },
        ])

        const res = await request(app)
            .get("/apis/learning-content")

        expect(res.body.success).toBe(true)
        expect(res.statusCode).toBe(200)
        expect(res.body.contentList.length).toBe(2)
    })
})

// --------------------- UPDATE ---------------------
describe("PUT /apis/learning-content/:id", () => {
    it("should update content successfully", async () => {
        const content = await LearningContent.create({
            main_topic: "supervised",
            sub_topic: "regression",
            title: "LR",
            description: "desc",
            main_content: "content",
        })

        const res = await request(app)
            .put(`/apis/learning-content/${content._id}`)
            .send({
                main_topic: "supervised",
                sub_topic: "regression",
                title: "LR",
                description: "desc",
                main_content: "content",
            })

        expect(res.statusCode).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.learningContent.title).toBe("LR")
    })

    it("should return 404 for invalid ID", async () => {
        const invalidId = new mongoose.Types.ObjectId()
        const res = await request(app)
            .put(`/apis/learning-content/${invalidId}`)
            .send({
                main_topic: "supervised",
                sub_topic: "regression",
                title: "LR",
                description: "desc",
                main_content: "content",
            })

        expect(res.statusCode).toBe(404)
        expect(res.body.success).toBe(false)
    })
})

// --------------------- DELETE ---------------------
describe("DELETE /apis/learning-content/:id", () => {
    it("should delete content successfully", async () => {
        const content = await LearningContent.create({
            main_topic: "supervised",
            sub_topic: "regression",
            title: "LR",
            description: "desc",
            main_content: "content",
        })

        const res = await request(app)
            .delete(`/apis/learning-content/${content._id}`)

        expect(res.statusCode).toBe(200)
        expect(res.body.success).toBe(true)
    })

    it("should return 404 for invalid ID", async () => {
        const invalidId = new mongoose.Types.ObjectId()
        const res = await request(app)
            .delete(`/apis/learning-content/${invalidId}`)

        expect(res.statusCode).toBe(404)
        expect(res.body.success).toBe(false)
    })
})
