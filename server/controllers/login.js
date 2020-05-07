const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const axios = require('axios')
const db = require('../models/index')
const bcrypt = require('bcrypt')

// Check for usre credentials on 'http://opetushallinto.cs.helsinki.fi/login'
// Data returned is in this format
// {
//   "username": "",
//   "student_number": "",
//   "first_names": "",
//   "last_name": ""
// }

// req user from auth server
const authenticateOpetushallinto = async (uid) => {
  try {
    const res = await axios.post(config.login,
      {
        'username': username,
        'password': password
      }
    )
    return res
  } catch (error) {
    throw error
  }
}

// Function for unit testing
const authenticateFake = (username, password) => {
  if (username === 'poju' && password === 'password') {
    return { // test data
      data: {
        username: 'poju',
        student_number: '123456789',
        first_names: 'Juhani',
        last_name: 'Pouta'
      }
    }
  } else if (username === 'tytto' && password === 'password') {
    return { // test data
      data: {
        username: 'tytto',
        student_number: '987654321',
        first_names: 'Katriina',
        last_name: 'Myrsky'
      }
    }
  }
  else {
    return {
      data: {
        error: 'incorrect credentials'
      }
    }
  }
}



// Route for handling login
loginRouter.post('/', async (req, res) => {
  try {
    // authenticate user
    //authResponse = authenticate()
    const authenticatedUser = {
      username: req.headers.uid,
      student_number: req.headers.schacpersonaluniquecode ? req.headers.schacpersonaluniquecode.split(':')[6] : null,
      first_names: req.headers.givenname,
      last_name: req.headers.sn
    }

    if (req.headers.employeenumber) {
      // is employee, do stuff
      // Check if the login is for admin
      await loginAdmin(req, res)
    } else {
      // authenticatedUser was found. Get student data or add student to database
      await loginStudent(req, res, authenticatedUser)
    }
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ error: 'authentication error' })
  }
})

//Method for logging in an admin
const loginAdmin = async (req, res) => {
  try {
    // find admin and user info
    const foundAdmin = await db.Admin.findOne({ where: { username: req.body.username } })

    const passwordCorrect = foundAdmin === null ?
      false : await bcrypt.compare(req.body.password, foundAdmin.passwordHash)

    if (!(foundAdmin && passwordCorrect)) {
      // incorrect credentials for admin or incorrect credentials response from auth server
      return res.status(401).json({ error: 'incorrect credentials' })
    }

    const foundUser = await db.User.findOne({ where: { role_id: foundAdmin.admin_id, role: 'admin' } })
    // jwt sign for admin
    const token = jwt.sign({ id: foundUser.user_id, role: foundUser.role }, config.secret, { expiresIn: '10h' })
    return res.status(200).json({
      token,
      user: {
        user_id: foundUser.user_id,
        role: 'admin'
      }
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ error: 'authentication error' })
  }
}

//Method for logging in a student
const loginStudent = async (req, res, authenticatedUser) => {
  try {
    // find student and user info
    const foundStudent = await db.Student.findOne({ where: { student_number: authenticatedUser.student_number } })
    if (foundStudent) {
      // user already in database, no need to add
      const foundUser = await db.User.findOne({ where: { role_id: foundStudent.student_id, role: 'student' } })
      const token = jwt.sign({ id: foundUser.user_id, role: foundUser.role }, config.secret, { expiresIn: '10h' })
      return res.status(200).json({
        token,
        user: {
          user_id: foundUser.user_id,
          role: 'student',
          email: foundStudent.email ? true : false // if the student has an email address added
        }
      })
    } else {
      // user not in database, add user
      const savedStudent = await db.Student
        .create({
          student_number: authenticatedUser.student_number,
          first_names: authenticatedUser.first_names,
          last_name: authenticatedUser.last_name,
          email: null
        })
      const savedUser = await db.User
        .create({
          role: 'student',
          role_id: savedStudent.student_id
        })
      const token = jwt.sign({ id: savedUser.user_id, role: savedUser.role }, config.secret, { expiresIn: '10h' })
      return res.status(200).json({
        token,
        user: {
          user_id: savedUser.user_id,
          role: savedUser.role,
          email: savedStudent.email ? true : false // if the student has an email address added
        }
      })
    }
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ error: 'authentication error' })
  }
}

module.exports = loginRouter