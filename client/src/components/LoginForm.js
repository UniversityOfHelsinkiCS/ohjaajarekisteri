import React, { useState } from 'react'
import { connect } from 'react-redux'
import { notify, setError } from './../reducers/actionCreators/notificationActions'
import { login } from './../reducers/actionCreators/loginActions'
import { Form, Button, Col, Container, Row, Spinner } from 'react-bootstrap'

export const LoginForm = ({ login, loadingUser }) => {


  const handleStudentLogin = () => {
    login('student')
  }

  const handleAdminLogin = () => {
    login('admin')
  }

  return (
    <div className='studentForm'>
      <Container>
        <Row>
          <Col>
            <div className='logHeader'>
              <h3>TKT – Assistant Register</h3>
              <h5>Login with University of Helsinki credentials</h5>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <Button onClick={handleStudentLogin} className="btnLogin" variant="dark" type="submit" disabled={loadingUser}>
              {
                loadingUser ?
                  <Spinner
                    animation="border"
                    size="sm"
                    role="status"
                  >
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                  :
                  'Login as student'
              }
            </Button>
            <Button onClick={handleAdminLogin} className="btnLogin" variant="dark" type="submit" disabled={loadingUser}>
              {
                loadingUser ?
                  <Spinner
                    animation="border"
                    size="sm"
                    role="status"
                  >
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                  :
                  'Login as admin'
              }
            </Button>
          </Col>
        </Row>
      </Container>
    </div >
  )
}

const mapStateToProps = (state) => {
  return {
    loadingUser: state.loggedUser.loadingUser
  }
}

export default connect(
  mapStateToProps,
  { notify, setError, login }
)(LoginForm)
