import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { updateLoggedUser } from '../../reducers/actionCreators/loginActions'
import studentActions from '../../reducers/actionCreators/studentActions'
import { notify } from '../../reducers/actionCreators/notificationActions'
import { Form, Button } from 'react-bootstrap'

export const ContactDetailsUpdateForm = ({
  phone,
  email,
  experience,
  canTeachEnglish,
  apprentice,
  updatePhone,
  updateEmail,
  updateLanguage,
  updateExperience,
  updateApprentice,
  updateLoggedUser,
  notify,
  id,
  getContactInformation,
  defaultInput
}) => {
  // gets the student from db and initializes and sends contact info to store
  useEffect(() => {
    getContactInformation(id)
  }, [])

  // takes new input values from the form, updates logged user
  const handleSubmit = (event) => {
    event.preventDefault()

    const input = {
      phone: event.target.phone.value,
      experience: event.target.experience.value,
      canTeachEnglish: event.target.canTeachEnglish.checked,
      apprentice: event.target.apprentice.checked
    }
    // gives error if experience is not defined
    if (input.experience.length < 20) {
      notify('Please describe your teaching experience (20 characters minumum)', 5)
    } else if (input.experience.length > 1000) {
      notify('Experience maximum length is 1000 characters', 5)
    } else {
      updateLoggedUser(input, id)
    }
  }

  experience = experience || ''

  return (
    <div>
      <div className='contactDetailsUpdateForm'>

        <h2>My profile</h2>
        <Form onSubmit={handleSubmit} className='firstDetails' >
          <h5>{defaultInput.first_names} {defaultInput.last_name} {defaultInput.student_number} </h5>
          <Form.Group>

            <Form.Label>Phone: </Form.Label>
            <Form.Control
              type='text'
              name='phone'
              value={phone || ''}
              onChange={(e) => updatePhone(e.target.value)}
            />

            <Form.Label>Assistance/teaching experience (remaining characters {1000 - experience.length}):</Form.Label>
            <Form.Control
              as='textarea'
              rows='2'
              type='text'
              name='experience'
              value={experience}
              onChange={(e) => updateExperience(e.target.value)}
            />

            <Form.Check
              type='checkbox'
              name='canTeachEnglish'
              checked={canTeachEnglish}
              value={canTeachEnglish}
              label="I can teach in English"
              onChange={(e) => updateLanguage(e.target.checked)}
            />

            <Form.Check
              type='checkbox'
              name='apprentice'
              checked={apprentice}
              value={apprentice}
              label='I have been an apprentice (kisälli)'
              onChange={(e) => updateApprentice(e.target.checked)}
            />

          </Form.Group>
          <Button className='button updateButton' type='submit'>Update</Button>
        </Form>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    defaultInput: state.students.contactInformation,
    phone: state.students.phone,
    email: state.students.email,
    experience: state.students.experience,
    canTeachEnglish: state.students.canTeachEnglish,
    apprentice: state.students.apprentice
  }
}

export default connect(
  mapStateToProps,
  { notify, updateLoggedUser, ...studentActions }
)(ContactDetailsUpdateForm)