const dummy = (blogs) => {
    return 1


}

const totalLikes = (blogsArr) => {
    return blogsArr.map(blog => blog.likes).reduce((accum, current) => accum + current, 0)
}




module.exports = {
    dummy,
    totalLikes
}