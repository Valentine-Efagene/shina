import Airtable from "airtable";
import { IStudent } from './../../interface/Student';
import { ICourse, ICourseHydrated } from './../../interface/Course';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface ICourseState {
  courses: ICourse[];
  status: 'idle' | 'loading' | 'failed';
  studentCourses: ICourseHydrated[];
}

const initialState: ICourseState = {
  courses: [],
  status: 'idle',
  studentCourses: []
}

const base = new Airtable({ apiKey: process.env.REACT_APP_API_KEY }).base(
  process.env.REACT_APP_BASE || ""
);

export const fetchAllCourses = createAsyncThunk('course/fetchAllCourses', async () => {
  let _courses: ICourse[] = []
  await base("classes")
    .select({ view: "Grid view" })
    .eachPage((records: any, fetchNextPage: () => void) => {
      _courses = records.map((record: { id: string, fields: { Name: string, Students: string[] } }) => { return { id: record.id, name: record.fields.Name, students: record.fields.Students } });
      fetchNextPage();
    });

  return _courses
})

export const fetchStudentCourses = createAsyncThunk('course/fetchStudentCourses', async (_, { getState }): Promise<ICourseHydrated[]> => {
  const { student: { currentStudent, students: _students }, course: { courses } } = getState() as { course: { courses: ICourse[] }, student: { currentStudent: IStudent, students: IStudent[] } }

  if (!currentStudent) {
    return []
  }

  let selectedCourses: ICourse[] = courses.filter(course => course.students.includes(currentStudent.id))
  const hydrated: ICourseHydrated[] = selectedCourses.map(course => { return { id: course.id, name: course.name, students: course.students.map(student => _students.find(std => std.id === student)) } })
  return hydrated
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
        state.studentCourses = action.payload
        state.status = 'failed'
      })
  }
})

export const { clearCourses } = courseSlices.actions
export default courseSlices.reducer
