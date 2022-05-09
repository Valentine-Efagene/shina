import { IStudent } from './../../interface/Student';
import { ICourse } from './../../interface/Course';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface ICourseState {
  courses: ICourse[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: ICourseState = {
  courses: [],
  status: 'idle'
}

const COURSES: ICourse[] = [
  { name: 'C02301', students: [{ name: 'John' }, { name: 'Sandra' }, { name: 'Juniper' }] },
  { name: 'C02302', students: [{ name: 'Sam' }, { name: 'Sandra' }, { name: 'Juniper' }] },
  { name: 'C02303', students: [{ name: 'Ken' }, { name: 'Lucy' }, { name: 'Juniper' }] }
]

export const fetchAllCourses = createAsyncThunk('course/fetchAllCourses', async (name: string) => {
  return COURSES
})

export const fetchStudentCourses = createAsyncThunk('course/fetchStudentCourses', async (student: IStudent | null) => {
  if (student === null) {
    return []
  }

  const studentCourses = COURSES.filter((course) => {
    for (let _student of course.students) {
      if (_student.name.toUpperCase() === student.name.toUpperCase()) {
        return true
      }
    }

    return false
  })

  return studentCourses ? studentCourses : []
})

const courseSlices = createSlice({
  name: 'course',
  initialState,
  reducers: {
    clearCourses: (state) => {
      state.courses = []
    },
  }, extraReducers: (builder) => {
    builder
      .addCase(fetchAllCourses.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.status = 'idle'
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.courses = action.payload
        state.status = 'failed'
      })
      .addCase(fetchStudentCourses.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchStudentCourses.rejected, (state, action) => {
        state.status = 'idle'
      })
      .addCase(fetchStudentCourses.fulfilled, (state, action) => {
        state.courses = action.payload
        state.status = 'failed'
      })
  }
})

export const { clearCourses } = courseSlices.actions
export default courseSlices.reducer
