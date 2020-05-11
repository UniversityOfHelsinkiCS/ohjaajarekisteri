const { app } = require('../index')
const supertest = require('supertest')
const api = supertest(app)
const db = require('../models/index')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const { initialAdmin } = require('./test_helper')
let studyProgramUrlsAtStart = null
let token = null
const index = 0

describe('tests for the studyProgramUrl controller', () => {
  jest.setTimeout(15000)
  beforeAll(async () => {
    await db.User.destroy({
      where: {}
    })

    const adminUser = await db.User.create(initialAdmin)
    token = jwt.sign({ id: adminUser.uid, role: adminUser.admin ? 'admin' : 'student' }, config.secret)
  })

  describe('When database has studyProgramUrls', () => {
    beforeEach(async () => {
      await db.StudyProgramUrl.destroy({
        where: {}
      })  

      studyProgramUrlsAtStart = [{ type: 'data', url: 'www.test.fi' }, { type: 'soft', url: 'www.stuff.com' }]

      studyProgramUrlsAtStart = await Promise.all(studyProgramUrlsAtStart.map(n => db.StudyProgramUrl.create(n)))
    })

    test('StudyProgramUrls are returned as json by GET /api/studyProgramUrls', async () => {
      const response = await api
        .get('/api/studyProgramUrls')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      
      expect(response.body.length).toBe(studyProgramUrlsAtStart.length)

      const returnedContents = response.body.map(n => n.url)
      studyProgramUrlsAtStart.forEach(studyProgramUrl => {
        expect(returnedContents).toContain(studyProgramUrl.url)
      })
    })

    test('Student can update his/her own data with PUT /api/students/:id', async () => {
      await api
        .put('/api/studyProgramUrls/')
        .set('Authorization', `bearer ${token}`)
        .send({ type: studyProgramUrlsAtStart[index].type, url: 'www.new.net' })
        .expect(200)
      
      const updatedStudyProgramUrl = await db.StudyProgramUrl.findOne({ where: { type: studyProgramUrlsAtStart[index].type } })
      expect(updatedStudyProgramUrl).not.toContain(studyProgramUrlsAtStart[0].url)
      expect(updatedStudyProgramUrl.url).toBe('www.new.net')
    })
  })
})