const blogRouter = require("express").Router()
const Blog = require("../models/blog")

// blogRouter.get('/', (request, response) => {
//   Blog.find({}).then((blogs) => {
//     response.json(blogs)
//   })
// })

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})


blogRouter.post('/', (request, response, next) => {
  const body = request.body

  if (!body.title) {
    return response.status(400).json({error: 'title missing'})
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  blog.save()
    .then(savedBlog => {
      response.status(201).json(savedBlog)
    })
    .catch(error => next(error))
})


module.exports = blogRouter