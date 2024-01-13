const helper = require('../utils/helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

test('blogs are returned as json',async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObj = helper.initialBlogs
    .map(blog => new Blog(blog))
  const blogPromiseArr = blogObj.map(blog => blog.save())
  await Promise.all(blogPromiseArr)
})

describe('tests the proper return of blog objects',  () => {

  test('checks if the blog object has an "id:"', async() => {
    const response = await api.get('/api/blogs')
    const contents = response.body[0]
    expect(helper.getKey(contents, 'id')).toContain('id')
  })

  test('Verify that a new blog is added to the Db',
    async() => {
      const oldPosts = await api.get('/api/blogs')
      const oldPostLength = oldPosts.body.length

      await api.post('/api/blogs').send(helper.additionalBlog)

      const allPosts = await api.get('/api/blogs')
      expect(allPosts.body.length).toBe(oldPostLength + 1)
    })

})

// test('dummy returns one', () => {
//   const blog = []

//   const result = helper.dummy(blog)
//   expect(result).toBe(1)
// })


// describe('returns the total number of likes in a blog list', () => {
//   const multipleBlogList = [
//     {
//       _id: '5a422a851b54a676234d17f7',
//       title: 'React patterns',
//       author: 'Michael Chan',
//       url: 'https://reactpatterns.com/',
//       likes: 7,
//       __v: 0
//     },
//     {
//       _id: '5a422aa71b54a676234d17f8',
//       title: 'Go To Statement Considered Harmful',
//       author: 'Edsger W. Dijkstra',
//       url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
//       likes: 5,
//       __v: 0
//     },
//     {
//       _id: '5a422b3a1b54a676234d17f9',
//       title: 'Canonical string reduction',
//       author: 'Edsger W. Dijkstra',
//       url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
//       likes: 12,
//       __v: 0
//     },
//     {
//       _id: '5a422b891b54a676234d17fa',
//       title: 'First class tests',
//       author: 'Robert C. Martin',
//       url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
//       likes: 10,
//       __v: 0
//     },
//     {
//       _id: '5a422ba71b54a676234d17fb',
//       title: 'TDD harms architecture',
//       author: 'Robert C. Martin',
//       url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
//       likes: 0,
//       __v: 0
//     },
//     {
//       _id: '5a422bc61b54a676234d17fc',
//       title: 'Type wars',
//       author: 'Robert C. Martin',
//       url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
//       likes: 2,
//       __v: 0
//     }
//   ]
//   test('return the tota number of likes for a given blog list', () => {
//     const result = helper.totalLikes(multipleBlogList)
//     expect(result).toBe(36)
//   })

// })

// describe('returns the properly formatted top blog object', () => {
//   const multipleBlogList = [
//     {
//       _id: '5a422a851b54a676234d17f7',
//       title: 'React patterns',
//       author: 'Michael Chan',
//       url: 'https://reactpatterns.com/',
//       likes: 7,
//       __v: 0
//     },
//     {
//       _id: '5a422aa71b54a676234d17f8',
//       title: 'Go To Statement Considered Harmful',
//       author: 'Edsger W. Dijkstra',
//       url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
//       likes: 5,
//       __v: 0
//     },
//     {
//       _id: '5a422b3a1b54a676234d17f9',
//       title: 'Canonical string reduction',
//       author: 'Edsger W. Dijkstra',
//       url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
//       likes: 12,
//       __v: 0
//     },
//     {
//       _id: '5a422b891b54a676234d17fa',
//       title: 'First class tests',
//       author: 'Robert C. Martin',
//       url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
//       likes: 10,
//       __v: 0
//     },
//     {
//       _id: '5a422ba71b54a676234d17fb',
//       title: 'TDD harms architecture',
//       author: 'Robert C. Martin',
//       url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
//       likes: 0,
//       __v: 0
//     },
//     {
//       _id: '5a422bc61b54a676234d17fc',
//       title: 'Type wars',
//       author: 'Robert C. Martin',
//       url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
//       likes: 2,
//       __v: 0
//     }
//   ]
//   test('return the top blog from multiple posts', () => {
//     const result = helper.favoriteBlog(multipleBlogList)

//     expect(result).toEqual({  title: 'Canonical string reduction',
//       author: 'Edsger W. Dijkstra',
//       likes: 12 })
//   })

// })

afterAll(async () => {
  mongoose.connection.close()
})