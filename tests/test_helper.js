const Blog = require('../models/blog')

const initialBlog = [
    {
        title: "My first blog",
        author: "Chase Hayes",
        url: "a url",
        likes: 5
    },
    {
        title: "Why so few likes?",
        author: "Chase Hayes",
        url: "a url",
        likes: 0
    }
]

const nonExistingId = async () => {
    const blog = new Blog({
        title: "Delete soon",
        author: "Chase H",
        url: "a url",
        likes: 0
    })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlog, nonExistingId, blogsInDb
}