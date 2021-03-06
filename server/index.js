const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const config = require('./config/config')
const logger = require('./utils/middleware/logger')
const cron = require('node-cron')
const logging = require('./config/config').logging
const updateCourses = require('./utils/middleware/updateCourses').updateCourses

// Run middleware given except for a specific path
const unless = (paths, middleware) => {
  return (req, res, next) => {
    if (paths.includes(req.path)) {
      return next()
    } else if (logging) {
      return middleware(req, res, next)
    } else {
      return next()
    }
  }
}
// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(unless(['/api/login', '/api/admins'], logger))
app.use(express.static('build'))

// Routers
const coursesRouter = require('./controllers/courses')
const studentsRouter = require('./controllers/students')
const loginRouter = require('./controllers/login')
const logoutRouter = require('./controllers/logout')
const tokenCheckRouter = require('./controllers/tokenCheck')
const studyProgramUrlsRouter = require('./controllers/studyProgramUrls')

const apiUrl = '/api'
app.use(`${apiUrl}/courses`, coursesRouter)
app.use(`${apiUrl}/students`, studentsRouter)
app.use(`${apiUrl}/login`, loginRouter)
app.use(`${apiUrl}/logout`, logoutRouter)
app.use(`${apiUrl}/tokenCheck`, tokenCheckRouter)
app.use(`${apiUrl}/studyProgramUrls`, studyProgramUrlsRouter)

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const DIST_PATH = path.resolve(__dirname, './build')
  const INDEX_PATH = path.resolve(DIST_PATH, 'index.html')

  app.use(express.static(DIST_PATH))
  app.get('*', (_, res) => res.sendFile(INDEX_PATH))
}

//Updates courses on database every day at one second before midnight
if (process.env.NODE_ENV !== 'test') {
  cron.schedule('59 23 * * *', async function () {
    try {
      await updateCourses()
    } catch (exception) {
      console.log(exception.message)
    }
  })
}

// Initialize server
const PORT = config.port
const server = http.createServer(app)

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
  // Database connection
  const db = require('./models')
  connect(db)
  {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  }
}

async function connect(db) {
  await db.connect()
  await updateCourses()
}


module.exports = {
  app, server
}
