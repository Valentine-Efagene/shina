import { combineReducers } from 'redux'

import studentReducer from '../slice/studentSlice'
import courseReducer from '../slice/courseSlice'

export default combineReducers({
  course: courseReducer,
  student: studentReducer,
})
