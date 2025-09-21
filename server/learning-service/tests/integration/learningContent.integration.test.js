const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const LearningContent = require('../../models/LearningContent')

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

describe("LearningContent Integration Tests", () => {
    it("should create and save successfully. ", async () => {

        const content = new LearningContent({
            main_topic: "supervised",
            sub_topic: "regression",
            title: "Linear Regression",
            description: "Intro to linear regression",
            main_content: "Detailed content here...",
            video_links: ["https://youtube.com/example"],
            examples: [{ text: "House price prediction", link: "https://example.com" }],
        });

        const saved = await content.save()
        
        expect(saved._id).toBeDefined()
        expect(saved.main_topic).toBe("supervised")
        expect(saved.thumbnail_image).toBe("")

    })

    it("should fail when required field(s) are missing", async () => {
        const content = new LearningContent({})

        await expect(content.save()).rejects.toThrow()
    })

    it("should fail when main_topic is missing", async () => {
        const content = new LearningContent({
            sub_topic: "regression",
            title: "Linear Regression",
            description: "Intro to linear regression",
            main_content: "Detailed content here...",
            video_links: ["https://youtube.com/example"],
            examples: [{ text: "House price prediction", link: "https://example.com" }],
        })

        await expect(content.save()).rejects.toThrow()
    })

    it("should fail when sub_topic is missing", async () => {
        const content = new LearningContent({
            main_topic: "supervised",
            title: "Linear Regression",
            description: "Intro to linear regression",
            main_content: "Detailed content here...",
            video_links: ["https://youtube.com/example"],
            examples: [{ text: "House price prediction", link: "https://example.com" }],
        })

        await expect(content.save()).rejects.toThrow()
    })

    it("should fail when example text is missing", async () => {
        const content = new LearningContent({
            main_topic: "supervised",
            title: "Linear Regression",
            description: "Intro to linear regression",
            main_content: "Detailed content here...",
            video_links: ["https://youtube.com/example"],
            examples: [{ link: "https://example.com" }],
        })

        await expect(content.save()).rejects.toThrow()
    })
})