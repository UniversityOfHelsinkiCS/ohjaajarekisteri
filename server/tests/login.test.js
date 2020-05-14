const { app } = require('../index')
const supertest = require('supertest')
const api = supertest(app)
const db = require('../models/index')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const { initialStudents, initialAdmin, usersInDb, studentsInDb, deleteUser } = require('./test_helper')

describe('/api/login', async () => {
  jest.setTimeout(15000)
  beforeEach(async () => {
    await db.User.destroy({
      where: {}
    })

    await db.User.create(initialAdmin)

    await Promise.all(initialStudents.map(async student => {
      await db.User.create(student)
    }))
  })

  test('student can login in with correct headers', async () => {
    const response = await api
      .post('/api/login')
      .set({
        uid: 'UToska',
        schacPersonalUniqueCode: 'urn:schac:personalUniqueCode:int:studentID:helsinki.fi:014339923',
        givenName: 'UusiHenkilö',
        sn: 'Toska',
        mail: 'grp-toska+ohrekstudent@helsinki.fi'
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    expect(response.body).toHaveProperty('token')
    expect(response.body).toHaveProperty('user')
  })

})