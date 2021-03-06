import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { initializeSummary } from '../../reducers/actionCreators/summaryActions'
import filterActions from '../../reducers/actionCreators/filterActions'
import { Table, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import TogglableButton from '../common/TogglableButton'
import { notify } from '../../reducers/actionCreators/notificationActions'
import { Badge } from 'react-bootstrap'

export const Summary = ({
  initializeSummary,
  summaryList,
  setYearFrom,
  setYearTo,
  setProgramme,
  setPeriod,
  setCourseName,
  filter
}) => {

  useEffect(() => {
    initializeSummary()
    setYearFrom(getThisYear())
  }, [])

  const handleProgrammeChange = (event) => {
    event.preventDefault()
    setProgramme(event.target.name)
  }

  const handlePeriodChange = (event) => {
    event.preventDefault()
    setPeriod(event.target.name)
  }

  const handleCourseNameChange = (event) => {
    event.preventDefault()
    setCourseName(event.target.value)
  }
  const handleYearFromChange = (event) => {
    event.preventDefault()
    setYearFrom(event.target.value)
  }
  const handleYearToChange = (event) => {
    event.preventDefault()
    setYearTo(event.target.value)
  }

  const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const getThisYear = () => {
    const today = new Date()
    return today.getFullYear()
  }

  return (
    <div>
      <h2>All courses and applicants</h2>
      <div>
        <div style={{ float: 'left' }}>
          <div style={{ color: '#6c757d' }}>Study programme:</div>
          <TogglableButton
            type='submit'
            name='TKT'
            onClick={handleProgrammeChange}
            filterValue={filter.studyProgramme}>
            CS-Bachelor
          </TogglableButton>
          <TogglableButton
            type='submit'
            name='CSM'
            onClick={handleProgrammeChange}
            filterValue={filter.studyProgramme}>
            CS-Master
          </TogglableButton>
          <TogglableButton
            type='submit'
            name='DATA'
            onClick={handleProgrammeChange}
            filterValue={filter.studyProgramme}>
            Data Science
          </TogglableButton>
        </div>

        <div style={{ float: 'left' }}>
          <div style={{ color: '#6c757d' }}>Period:</div>
          {summaryList && summaryList
            .map(c => c.periods[0])
            .filter(onlyUnique)
            .sort()
            .map(period => {
              return (
                <TogglableButton
                  key={period}
                  type='submit'
                  name={period}
                  onClick={handlePeriodChange}
                  filterValue={filter.period}>
                  {period}
                </TogglableButton>
              )
            })}
        </div>

        <div style={{ float: 'right' }}>
          <div style={{ color: '#6c757d' }}> Filter:</div>
          <Form.Control
            className='filterInput'
            value={filter.course_name}
            onChange={handleCourseNameChange} />
        </div>

        <div style={{ float: 'right' }}>
          <div style={{ color: '#6c757d' }}>Year To:</div>
          <Form.Control
            className='filterYearInput'
            value={filter.year}
            onChange={handleYearToChange} />
        </div>

        <div style={{ float: 'right' }}>
          <div style={{ color: '#6c757d' }}>Year From:</div>
          <Form.Control
            className='filterYearInput'
            value={filter.year}
            onChange={handleYearFromChange}
            defaultValue={getThisYear()} />
        </div>
      </div>

      <Table className='summaryCourseList' bordered hover size="sm">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th className='centerColumn' >Year</th>
            <th className='centerColumn wrapSmallCell' >Starting Period</th>
            <th>Applicants</th>
          </tr>
        </thead>

        <tbody>
          {summaryList
            .filter(course => course.users.length !== 0)
            .filter(course => {
              let period = course.periods[0].toString(10)
              return (
                (
                  (filter.yearFrom ? course.year >= Number(filter.yearFrom) : true)
                  &&
                  (filter.yearTo ? course.year <= Number(filter.yearTo) : true)
                )
                &&
                (
                  course.course_name.toLowerCase().includes(filter.courseName.toLowerCase())
                  ||
                  course.learningopportunity_id.toLowerCase().includes(filter.courseName.toLowerCase())
                )
                &&
                course.learningopportunity_id.includes(filter.studyProgramme)
                &&
                period.includes(filter.period)
              )
            })
            .map(course =>
              <tr key={course.course_id}>
                <td><Link to={`courses/${course.course_id}`}>{course.learningopportunity_id}</Link></td>
                <td width='400' className="courseName">{course.course_name}</td>
                <td className='centerColumn' >{course.year}</td>
                <td className='centerColumn' >{course.periods[0]}</td>
                <td>
                  <Table className='summaryStudentList' style={{ padding: '0', margin: '0' }} hover size="sm">
                    <tbody>
                      {course.users.map(user =>
                        <tr key={user.uid} >
                          <td width='80' shrink-to-fit='no' >
                            <Link to={`/admin/students/${user.uid}/info`}>
                              {user.student_number}
                            </Link>
                          </td>
                          <td className="studentName centerColumn"> {user.first_names} {user.last_name}</td>
                          <td width='75'> {user.Application.accepted ? <Badge variant="success">Accepted</Badge> : <Badge variant="secondary">Pending</Badge>}</td>
                          <td width='50'>
                            {user.canTeachEnglish ?
                              <img
                                src={require('../../Images/finnishFlag.png')}
                                width='30'
                                height='20'
                                alt="Finnish Flag"
                              />
                              :
                              <img
                                src={require('../../Images/englishFlag.svg')}
                                width='30'
                                height='20'
                                alt="English Flag"
                              />
                            }
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </td>
              </tr>
            )}
        </tbody>
      </Table>
    </div >
  )
}

const mapStateToProps = (state) => {
  return {
    summaryList: state.summary.summary,
    filter: {
      courseName: state.filter.courseName,
      yearFrom: state.filter.yearFrom,
      yearTo: state.filter.yearTo,
      studyProgramme: state.filter.studyProgramme,
      period: state.filter.period
    }
  }
}

export default connect(
  mapStateToProps,
  { initializeSummary, notify, ...filterActions }
)(Summary)
