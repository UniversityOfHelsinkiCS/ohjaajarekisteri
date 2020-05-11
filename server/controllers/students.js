const studentsRouter = require('express').Router()
const db = require('../models/index')
const { checkUser, checkAdmin } = require('../utils/middleware/checkRoute')


//Get request that returns all students as JSON
studentsRouter.get('/', checkAdmin, async (req, res) => {
  try {
    let students = await db.User.findAll({ where: { admin: false }})
    res.status(200).json(students)
  } catch (exception) {
    console.log(exception.message)
    res.status(400).json({ error: 'Could not get studentlist from db' })
  }
})

//Get request that returns a student based on id
studentsRouter.get('/:id', checkUser, async (req, res) => {
  try {
    const user = await db.User
      .findByPk(req.params.id)
    res.status(200).json(user)
  } catch (exception) {
    console.log(exception.message)
    res.status(400).json({ error: 'Could not get student from db' })
  }
})

//Get request that returns a student based on id for admin
studentsRouter.get('/:id/info', checkAdmin, async (req, res) => {
  try {
    const student = await db.User
      .findByPk(req.params.id)
    res.status(200).json(student)
  } catch (exception) {
    console.log(exception.message)
    res.status(400).json({ error: 'Could not get student from db' })
  }
})

//Get request that returns all of the courses a student is on
studentsRouter.get('/:id/courses', checkUser, async (req, res) => {
  try {
    const user = await db.User
      .findByPk(req.params.id)
    const courses = await user.getCourses()
    res.status(200).json(courses)
  } catch (exception) {
    res.status(400).json({ error: 'Could not get the course list from db' })
  }
})

//Get request that returns all of the courses a student is on for admin
studentsRouter.get('/:id/info/courses', checkAdmin, async (req, res) => {
  try {
    const student = await db.User
      .findByPk(req.params.id)
    const courses = await student.getCourses()
    res.status(200).json(courses)
  } catch (exception) {
    res.status(400).json({ error: 'Could not get the course list from db' })
  }
})

// Adds student to given courses
studentsRouter.post('/:id/courses/apply', checkUser, async (req, res) => {
  const body = req.body
  try {
    // get current user from db
    const user = await db.User.findOne({
      where: {
        uid: req.params.id
      }
    })

    // finds all courses with given course id, and adds them to the student-course association table
    const applied = await Promise.all(body.course_ids.map(async course_id => {
      const course = await db.Course.findOne({
        where: {
          course_id: course_id
        }
      })
      // sequelize method that creates a association for student - course
      await user.addCourse(course)
      return course
    }))
    res.status(201).json(applied)

  } catch (exception) {
    console.log(exception.message)
    res.status(400).json({ error: 'bad req' })
  }

})

// Removes relation between student and course
studentsRouter.delete('/:id/courses/:course_id', checkUser, async (req, res) => {
  try {
    // get current user from db
    const user = await db.User.findOne({
      where: {
        uid: req.params.id
      }
    })

    // check if course exists in db
    let course = await db.Course.findOne({
      where: {
        course_id: req.params.course_id
      }
    })

    // sequelize method to severe connection from assossication table
    await user.removeCourse(course)
    res.status(204).end()

  } catch (exception) {
    console.log(exception.message)
    res.status(400).json({ error: 'bad request' })
  }
})


//Delete request for Admin that deletes a student from database with student number
studentsRouter.delete('/admin/:student_number', checkAdmin, async (req, res) => {
  try {
    await db.User.destroy({ where: { student_number: req.params.student_number } })
    res.status(204).end()

  } catch (exception) {
    console.log(exception)
    res.status(400).json({ error: 'bad req' })
  }
})

//Updates students contact details
studentsRouter.put('/:id', checkUser, async (req, res) => {
  try {
    let user = await db.User.findOne({ where: { uid: req.params.id } })
    const body = req.body

    await user.update({ phone: body.phone, experience: body.experience, can_teach_in_english: !body.canTeachEnglish, apprentice: body.apprentice })
    res.status(200).end()
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ error: 'bad req' })
  }
})

//Hides a course if it is not hidden and makes it visible if it is hidden.
studentsRouter.put('/:id/:course_id/hide', checkUser, async (req, res) => {
  try {
    const user = await db.User.findOne({ where: { uid: req.params.id } })
    let application = await db.Application.findOne({ where: { course_id: req.params.course_id, user_id: user.uid } })

    application = await application.update({ hidden: !application.hidden })
    res.status(200).json(application)
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ error: 'bad req' })
  }
})

module.exports = studentsRouter