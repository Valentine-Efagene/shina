import Airtable from 'airtable';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import LoadingState from '../../interface/LoadingState'
import { IStudent } from '../../interface/Student'

interface IStudentState {
  students: IStudent[]
  currentStudent: IStudent | null | undefined
  status: LoadingState;
}

const initialState: IStudentState = {
  students: [],
  currentStudent: {
    id: '',
    name: ''
  },
  status: LoadingState.IDLE
}


const base = new Airtable({ apiKey: process.env.REACT_APP_API_KEY }).base(
  process.env.REACT_APP_BASE || ""
);

export const fetchAllStudents = createAsyncThunk('student/fetchAllStudents', async (): Promise<IStudent[]> => {
  let _students: IStudent[] = [{ name: '', id: '' }]
  await base("students")
    .select({ view: "Grid view" })
    .eachPage((records: any, fetchNextPage: () => void) => {
      _students = records.map((record: { id: string, fields: { Name: string, Classes: string[] } }) => { return { id: record.id, name: record.fields.Name } });
      fetchNextPage();
    });

  return _students
})

export const login = createAsyncThunk('student/login', async (name: string, { getState }): Promise<IStudent | null | undefined> => {
  if (name === '' || name === undefined || name === null) return null
  const { student: { students } } = getState() as { student: { students: IStudent[] } }

  return students.find(student => student.name === name)
})

const studentSlices = createSlice({
  name: 'student',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentStudent = null
    },
  }, extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.status = LoadingState.LOADING
      })
      .addCase(login.rejected, (state, action) => {
        state.status = LoadingState.IDLE
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = LoadingState.IDLE
        state.currentStudent = action.payload
      })
      .addCase(fetchAllStudents.pending, (state, action) => {
        state.status = LoadingState.LOADING
      })
      .addCase(fetchAllStudents.rejected, (state, action) => {
        state.status = LoadingState.IDLE
      })
      .addCase(fetchAllStudents.fulfilled, (state, action) => {
        state.status = LoadingState.IDLE
        state.students = action.payload
      })
  }
})

export const { logout } = studentSlices.actions
export default studentSlices.reducer
