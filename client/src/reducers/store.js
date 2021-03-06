import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import studentReducer from './studentReducer'
import courseReducer from './courseReducer'
import singleCourseReducer from './singleCourseReducer'
import notificationReducer from './notificationReducer'
import loginReducer from './loginReducer'
import courseApplicationReducer from './courseApplicationReducer'
import filterReducer from './filterReducer'
import singleStudentReducer from './singleStudentReducer'
import summaryReducer from './summaryReducer'

const reducer = combineReducers({
  notification: notificationReducer,
  students: studentReducer,
  courses: courseReducer,
  singleCourse: singleCourseReducer,
  loggedUser: loginReducer,
  courseApplication: courseApplicationReducer,
  filter: filterReducer,
  singleStudent: singleStudentReducer,
  summary: summaryReducer
})

const store = createStore(
  reducer,
  applyMiddleware(thunk)
)

export default store