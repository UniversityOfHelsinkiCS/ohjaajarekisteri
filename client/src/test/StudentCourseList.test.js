import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { mount } from 'enzyme'
import { StudentCourseList } from '../components/student/StudentCourseList'

describe('<StudentCourseList />', () => {
  let courseList, props
  beforeAll(() => {
    props = {
      getStudentCourses: jest.fn(),
      deleteAppliedCourse: jest.fn(),
      notify: jest.fn(),
      id: 1,
      loggedUser: {
        user: {
          user_id: 1,
          token: '...'
        }
      },
      courses: [
        {
          course_id: 'TKT 202020',
          course_name: 'OHTU',
          course_year: 2019,
          startingDate: '02.09.2019',
          periods: [2],
          Application: {
            groups: 0,
            accepted: false,
            hidden: false
          }
        },
        {
          course_id: 'TKT 202111',
          course_name: 'OHTU2',
          course_year: 2042,
          startingDate: '02.09.2042',
          periods: [2],
          Application: {
            groups: 0,
            accepted: false,
            hidden: false
          }
        }
      ]
    }

    courseList = mount(
      <Router>
        <StudentCourseList {...props} />
      </Router>
    )
  })

  afterAll(() => {
    courseList.unMount()
  })

  it('renders self', () => {
    let table = courseList.find('.courseList')
    expect(table.length).toBe(1)
  })

  describe('useEffect', () => {
    it('calls getContactInformation and getStudentCourses', () => {
      courseList = mount(
        <Router>
          <StudentCourseList {...props} />
        </Router>
      )
      setTimeout(() => {
        expect(props.getStudentCourses).toHaveBeenCalledTimes(1)
      }, 50)
    })
  })


})