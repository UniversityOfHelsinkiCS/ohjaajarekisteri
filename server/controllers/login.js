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
      console.log('USER', user)
      
      return res.status(200).json({
        token,
        user: {
          uid: user.uid,
          email: user.email,
          role,
          hasFilledExperienceField: !!user.experience
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
          experience: ''
        })
      const role = savedUser.admin ? 'admin' : 'student'

      const token = jwt.sign({ id: savedUser.uid, role }, config.secret, { expiresIn: '10h' })
      return res.status(200).json({
        token,
        user: {
          uid: savedUser.uid,
          email: mail,
          role,
          hasFilledExperienceField: !!savedUser.experience
        }
      })
    }

  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ error: 'authentication error' })
  }
})

module.exports = loginRouter