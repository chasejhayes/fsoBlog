const mongoose = require("mongoose")





// const mongoUrl = 'mongodb://localhost/bloglist'
// mongoose.connect(mongoUrl, { family: 4 })

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Blog", blogSchema)



// //  {
//      "title": "String",
//     "author": "String",
//     "url": "String",
//     "likes": "Number",
// }