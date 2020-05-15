import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom'
import { NavBar } from './components/common/NavBar'

// Components
import LoginForm from './components/LoginForm'
import ContactDetailsForm from './components/student/ContactDetailsForm'
import ContactDetailsUpdateForm from './components/student/ContactDetailsUpdateForm'
import AdminCourseList from './components/admin/CourseList'
import Summary from './components/admin/Summary'
import StudentDelete from './components/admin/StudentDelete'
import CourseApplicationList from './components/student/CourseApplicationList'
import SingleCourse from './components/admin/SingleCourse'
import SingleStudent from './components/admin/SingleStudent'
import PrivateRoute from './components/common/PrivateRoute'
import Notification from './components/common/Notification'
import StudentCourseList from './components/student/StudentCourseList'
import GDPRInfo from './components/student/GDPRInfo'

// Actions
import { logout, initLoggedUser } from './reducers/actionCreators/loginActions'

const App = (props) => {

  useEffect(() => {
    props.initLoggedUser()
  }, [])

  const { loggedUser, logoutUrl } = props

  console.log('LOGOUT URL', logoutUrl)

  const hasContactDetails =
    (
      loggedUser
      &&
      loggedUser.user.role === 'student'
      &&
      loggedUser.user.hasFilledExperienceField
    )

  const isAdmin = loggedUser && loggedUser.user.role === 'admin'

  if (logoutUrl) {
    window.location.href = logoutUrl
  }

  return (
    <div>
      { /* eslint-disable */}
      <Router basename={process.env.PUBLIC_URL}>
        { /* eslint-enable */}

        <React.Fragment>

          <NavBar
            loggedUser={loggedUser}
            logout={props.logout}
          />

          <Notification />
          <div className="container">
            {/*
            Works like a typical switch statement; it checks for matches and
            runs the first thing matching the requested path
          */}
            <Switch>

              {/* THIS ROUTE PROTECTS ALL ROUTES UNDER "/admin" */}
              <PrivateRoute
                path="/admin"
                redirectPath="/login"
                condition={loggedUser && isAdmin}
              >
                <Route exact path="/admin/courses" render={() => <AdminCourseList />} />
                <Route exact path="/admin/summary" render={() => <Summary />} />
                <Route exact path="/admin/studentDelete" render={() => <StudentDelete />} />
                <Route
                  exact path="/admin/courses/:id"
                  render={({ match }) => <SingleCourse courseId={match.params.id} />}
                />
                <Route
                  exact path="/admin/students/:id/info"
                  render={({ match }) => <SingleStudent studentId={match.params.id} />}
                />
              </PrivateRoute>

              <PrivateRoute
                exact path="/login"
                redirectPath="/apply"
                condition={loggedUser === null}
                render={() => <LoginForm />}
              />

              {/* USER IS REDIRECTED HERE IF THEY DON'T HAVE AN EMAIL ADDED */}
              <PrivateRoute
                exact path="/contact-info"
                redirectPath="/login"
                condition={!hasContactDetails && loggedUser}
                render={() => <ContactDetailsForm id={loggedUser.user.uid} />}
              />


              {/* THIS ROUTE PROTECTS ALL ROUTES UNDER "/" */}
              <PrivateRoute path="/" redirectPath="/login" condition={loggedUser}>
                <PrivateRoute path="/" redirectPath="/admin/courses" condition={!isAdmin}>
                  <PrivateRoute path="/" redirectPath="/contact-info" condition={hasContactDetails}>
                    <Route
                      exact path='/'
                      render={() => <Redirect to='/apply' />}
                    />
                    <Route
                      exact path="/apply"
                      render={() => <CourseApplicationList id={loggedUser.user.uid} />}
                    />

                    {/* USERS CAN UPDATE THEIR INFORMATION */}
                    <Route
                      exact path="/update-info"
                      render={() => <ContactDetailsUpdateForm id={loggedUser.user.uid} />}
                    />
                    {/* USERS CAN SEE THEIR APPLICATIONS */}
                    <Route
                      exact path="/applications"
                      render={() => <StudentCourseList id={loggedUser.user.uid} />}
                    />
                    {/* GDPR INFORMATION VIEW */}
                    <Route
                      exact path="/privacy"
                      render={() => <GDPRInfo />}
                    />
                  </PrivateRoute>
                </PrivateRoute>
              </PrivateRoute>
            </Switch>
          </div>
        </React.Fragment>
      </Router>
    </div >

  )
}

const mapStateToProps = (state) => {
  return {
    loggedUser: state.loggedUser.loggedUser,
    logoutUrl: state.loggedUser.logoutUrl
  }
}

export default connect(
  mapStateToProps,
  { logout, initLoggedUser }
)(App)
