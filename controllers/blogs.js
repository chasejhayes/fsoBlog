const blogRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require('../models/users')


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})



blogRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.find({})
  const addedUser = user[0]

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: addedUser._id
  })
  const savedBlog = await blog.save()
  addedUser.blogs = addedUser.blogs.concat(savedBlog)
  await addedUser.save()
  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()

})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
    console.log(blog)
  } else {
    response.status(404).end()
  }
})

blogRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body
  const changedNote = await Blog.findById(request.params.id)
  if (!changedNote) {
    return response.status(404).end()
  }

  changedNote.title = title
  changedNote.url = url
  changedNote.likes = likes
  changedNote.author = author

  await changedNote.save()
  response.json(changedNote)


})

module.exports = blogRouter


// {
//     "title": "Changed Blog",
//     "author": "Chase H",
//     "url": "a url",
//     "likes": 1

// }