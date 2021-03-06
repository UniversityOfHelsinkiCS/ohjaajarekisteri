import courseService from '../../services/courses'

export const initializeSingleCourse = (id) => {
  return async (dispatch) => {
    const course = await courseService.getOne(id)
    dispatch({
      type: 'INIT_COURSE',
      data: course
    })
    // Fetch applicants
    const applicants = await courseService.getStudents(id)
    // Add field for controlling checkbox
    const content = applicants.map(a => {
      return {
        ...a,
        email_to_checked: false,
        accepted_checked: a.accepted,
        groups_textbox: a.groups
      }
    })
    dispatch({
      type: 'INIT_APPLICANTS',
      data: content
    })
  }
}

export const setStudentAccepted = (uid, accepted_checked) => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_STUDENT_ACCEPTED_STATE',
      data: {
        uid,
        accepted_checked
      }
    })
  }
}

export const setStudentGroups = (uid, groups_textbox) => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_STUDENT_GROUPS_STATE',
      data: {
        uid,
        groups_textbox
      }
    })
  }
}

export const sendAcceptedModified = (course_id, modifiedApplicants) => {
  return async (dispatch) => {
    const applicants = await courseService.sendAcceptedModified(course_id, modifiedApplicants)
    if (applicants.error) {
      dispatch({
        type: 'NOTIFY',
        data: 'Could not update course.'
      })
      setTimeout(() => {
        dispatch({
          type: 'CLEAR',
        })
      }, 3000)
    } else {
      dispatch({
        type: 'NOTIFY',
        data: 'Changes have been saved.'
      })
      setTimeout(() => {
        dispatch({
          type: 'CLEAR',
        })
      }, 3000)
      const content = applicants.map(a => {
        return {
          ...a,
          email_to_checked: false,
          accepted_checked: a.accepted,
          groups_textbox: a.groups
        }
      })
      dispatch({
        type: 'INIT_APPLICANTS',
        data: content
      })
    }
  }
}

export const setEmail = (uid, email_to_checked) => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_EMAIL_CHECKED',
      data: {
        uid,
        email_to_checked
      }
    })
  }
}

export default { initializeSingleCourse, setEmail, setStudentAccepted, sendAcceptedModified, setStudentGroups }