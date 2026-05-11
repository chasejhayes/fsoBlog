const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)



beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlog[0])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlog[1])
    await blogObject.save()
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlog.length)
})

test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const title = response.body.map(e => e.title)
    assert(title.includes("My first blog"))
})

test.only('blog is defined by id', async () => {
   
    const blogs = await helper.blogsInDb()
    const checkAll = blogs.every(obj => obj.hasOwnProperty('id'))
    assert.strictEqual(checkAll, true)
})


test('a valid blog can be added ', async () => {
    const newBlog = {
        title: "Title",
        author: "Chase",
        url: "testurl",
        likes: 10
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlog.length + 1)

    const titles = blogsAtEnd.map(r => r.title)
    assert(titles.includes('Title'))
})

test('blog without title is not added', async () => {
    const newBlog = {
        author: "Chase",
        url: "testurl",
        likes: 10
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlog.length)
})

test.only('delete note', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const ids = blogsAtEnd.map(n => n.id)
    assert(!ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlog.length -1)
})


after(async () => {
    await mongoose.connection.close()
})