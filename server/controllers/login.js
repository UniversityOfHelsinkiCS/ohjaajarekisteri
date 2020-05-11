const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const axios = require('axios')
const db = require('../models/index')


// Route for handling login
loginRouter.post('/', async (req, res) => {
  try {
    const { 
      uid,
      schacpersonaluniquecode,
      givenname,
      sn,
      mail
    } = req.headers

    const user = await db.User.findOne({ where: { uid }})

    if (user) {
      // user already in database, no need to add
      const role = user.admin ? 'admin' : 'student'
      const token = jwt.sign({ id: user.uid, role }, config.secret, { expiresIn: '10h' })
      return res.status(200).json({
        token,
        user: {
          uid: user.uid,
          role,
          email: user.email ? true : false // if the student has an email address added
        }
      })
    } else {
      const savedUser = await db.User
        .create({
          uid,
          student_number: schacpersonaluniquecode ? schacpersonaluniquecode.split(':')[6] : null,
          first_names: givenname,
          last_name: sn,
          email: mail,
        })
      const role = savedUser.admin ? 'admin' : 'student'

      const token = jwt.sign({ id: savedUser.uid, role }, config.secret, { expiresIn: '10h' })
      return res.status(200).json({
        token,
        user: {
          uid: savedUser.uid,
          role,
          email: savedUser.email ? true : false // if the student has an email address added
        }
      })
    }

  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ error: 'authentication error' })
  }
})

module.exports = loginRouter