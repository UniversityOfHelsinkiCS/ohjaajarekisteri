import React from 'react'
import { connect } from 'react-redux'
import { updateLoggedUser } from '../../reducers/actionCreators/loginActions'
import { notify } from '../../reducers/actionCreators/notificationActions'
import { Form, Button } from 'react-bootstrap'
import studentActions from '../../reducers/actionCreators/studentActions'
import GDPRInfo from './GDPRInfo'

export const ContactDetailsForm = ({
  updateLoggedUser,
  id,
  notify,
  updateLanguage,
  updateExperience,
  updatePhone,
  updateApprentice
}) => {

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formContent = {
      phone: event.target.phonenumber.value,
      experience: event.target.experience.value,
      canTeachEnglish: event.target.canTeachEnglish.checked,
      apprentice: event.target.apprentice.checked
    }
    
    if (formContent.experience.length < 20) {
      notify('Please describe your teaching experience (20 characters minumum)', 5)
    } else if (formContent.experience.length > 1000) {
      notify('Experience maximum length is 1000 characters', 5)
    } else {
      updateLoggedUser(formContent, id)
    }
  }

  return (
    <div className='studentForm'>

      <h2>Contact details </h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Phone: </Form.Label>
          <Form.Control
            type='text'
            name='phonenumber'
            onChange={(e) => updatePhone(e.target.value)}
          />
          <Form.Label>Assistance/teaching experience (max length 1000 characters):</Form.Label>
          <Form.Control
            as='textarea'
            rows='2'
            type='text'
            name='experience'
            onChange={(e) => updateExperience(e.target.value)}
          />

          <Form.Check
            type='checkbox'
            name='canTeachEnglish'
            label="I can teach in English"
            onChange={(e) => updateLanguage(e.target.checked)}
          />

          <Form.Check
            type='checkbox'
            name='apprentice'
            label='I have been an apprentice (kisälli)'
            onChange={(e) => updateApprentice(e.target.checked)}
          />

        </Form.Group>
        <Button className='button' type='submit'>send</Button>
      </Form>
      <div className="grayInfoText">
        <GDPRInfo />
      </div>
    </div>
  )
}


export default connect(
  null,
  { notify, updateLoggedUser, ...studentActions }
)(ContactDetailsForm)