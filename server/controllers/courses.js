const coursesRouter = require('express').Router()
const db = require('../models/index')
const { checkAdmin, checkLogin, authenticateToken } = require('../utils/middleware/checkRoute')
const { parseDate } = require('../utils/middleware/dateUtility')

//Get request that returns all courses on current period 
coursesRouter.get('/', checkLogin, async (req, res) => {
  try {
    let courses = null
    const token = authenticateToken(req)
    //Courses and their applicants for admin
    if(token.role === 'admin') {
      courses = await db.Course.findAll({
        include: [{
          model: db.User,
          as: 'users',
          attributes: ['uid'],
          through: { attributes: ['accepted'] }
        }]
      })
    } else {
      //Courses that are not hidden for others
      courses = await db.Course.findAll({ where: { hidden: false } })
    }
    const today = new Date()
    //Array of all courses that have not ended
    const onGoingCourses = courses.filter(c => {
      const courseEndDate = parseDate(c.endingDate)
      return (today.getTime()<=courseEndDate.getTime())
    })
    //One week in milliseconds
    const weekInMs = 604800000

    //Array of all courses which are have been on going for less than three weeks
    const filteredCourses = onGoingCourses.filter(c => {
      const courseStartDate = parseDate(c.startingDate)
      const courseEndDate = parseDate(c.endingDate)
      const duration = courseEndDate.getTime() - courseStartDate.getTime()
      const timeLeft = courseEndDate.getTime() - today.getTime() 
      return (timeLeft > (duration - (weekInMs * 3)))
    })

    res.status(200).json(filteredCourses)
  } catch (exception) {
    console.log(exception.message)
    res.status(400).json({ error: 'malformatted json' })
  }

})


//Get request that returns all courses on the database 
coursesRouter.get('/all', checkLogin, async (req, res) => {
  const courses = await db.Course.findAll({})
  res.status(200).json(courses)
})

//Get request that returns all courses on the database with its applicants
coursesRouter.get('/summary', checkAdmin, async (req, res) => {
  try {
    const courses = await db.Course.findAll({
      include: [{
        model: db.User,
        as: 'users'
      }]
    })
    res.status(200).json(courses)

  } catch (error) {
    console.log(error.message)
    res.status(400).json({ error: 'malformatted request' })
  }
})



//Get request that returns a course based on id
coursesRouter.get('/:id', checkLogin, async (req, res) => {
  const course = await db.Course
    .findByPk(req.params.id)
  res.status(200).json(course)
})

//Get request that returns all of the students on a course
coursesRouter.get('/:id/students', checkAdmin, async (req, res) => {
  const course = await db.Course
    .findByPk(req.params.id)
  const users = await course.getUsers()
  const returnedUsers = users.map(user => {
    return {
      email: user.email,
      experience: user.experience,
      first_names: user.first_names,
      last_name: user.last_name,
      can_teach_in_english: user.can_teach_in_english,
      apprentice: user.apprentice,
      phone: user.phone,
      uid: user.uid,
      student_number: user.student_number,
      accepted: user.Application.accepted,
      groups: user.Application.groups
    }
  })
  res.status(200).json(returnedUsers)
})

// Updates application status and group numbers of all applicants on a course
coursesRouter.post('/:id/students/', checkAdmin, async (req, res) => {
  try {
    const course = await db.Course
      .findByPk(req.params.id)
    let users = await course.getUsers()
    users.forEach(user => {
      const foundUser = req.body.find(a => a.uid === user.uid)
      user.Application = {
        ...user.Application,
        accepted: foundUser ? foundUser.accepted : user.Application.accepted,
        groups: foundUser ? foundUser.groups : user.Application.groups
      }
      return user
    })
    await course.setUsers(users)
    users = await course.getUsers({})

    const returnedUsers = users.map(user => {
      return {
        email: user.email,
        experience: user.experience,
        first_names: user.first_names,
        last_name: user.last_name,
        can_teach_in_english: user.can_teach_in_english,
        apprentice: user.apprentice,
        phone: user.phone,
        uid: user.uid,
        student_number: user.student_number,
        accepted: user.Application.accepted,
        groups: user.Application.groups
      }
    })
    res.status(200).json(returnedUsers)
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ error: 'malformatted request' })
  }
})

//Hides a course if it is not hidden and makes it visible if it is hidden.
coursesRouter.put('/:id/hide', checkAdmin, async (req, res) => {
  try {
    let course = await db.Course.findOne({ where: { course_id: req.params.id } })

    course = await course.update({ hidden: !course.hidden })
    res.status(200).json(course)

  } catch (error) {
    console.log(error.message)
    res.status(400).json({ error: 'bad req' })
  }
})

/*
//DEV Post request that adds a course to the database
coursesRouter.post('/', async (request, response) => {
  try {

    const course = await db.Course.create({
      learningopportunity_id: request.body.learningopportunity_id,
      course_name: request.body.course_name,
      period: request.body.period,
      year: request.body.year,
      groups: request.body.groups
    })
    response.status(201).json(course)

  } catch (exception) {
    console.log(exception.message)
    response.status(400).json({ error: 'bad request' })
  }
})

//DEV Delete request that deletes a course from the database based on id
coursesRouter.delete('/:id', async (request, response) => {
  try {
    await db.Course.destroy({ where: { course_id: request.params.id } })
    response.status(204).end()

  } catch (exception) {
    console.log(exception)
    response.status(400).json({ error: 'bad request' })
})
*/

module.exports = coursesRouter
