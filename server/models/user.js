'use strict'

//Sequelize model for User database object
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    uid: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    student_number: {
      type: Sequelize.STRING(16),
      allowNull: true,
      unique: true
    },
    first_names: {
      type: Sequelize.STRING(127),
      allowNull: false
    },
    last_name: {
      type: Sequelize.STRING(127),
      allowNull: false
    },
    can_teach_in_english: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    experience: {
      type: Sequelize.STRING(1000),
      allowNull: true
    },
    phone: {
      type: Sequelize.STRING(31),
      allowNull: true
    },
    email: {
      type: Sequelize.STRING(127),
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    apprentice: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    admin: {
      type: Sequelize.BOOLEAN,
      default: false
    }
  })

  User.associate = (models) => {
    User.belongsToMany(models.Course, {
      through: 'Application',
      foreignKey: 'user_id',
      as: 'courses'
    })
  }

  return User
}