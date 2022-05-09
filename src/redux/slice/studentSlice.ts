import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import LoadingState from '../../interface/LoadingState'
import { IStudent } from '../../interface/Student'

interface IStudentState {
  student: IStudent | null
  status: LoadingState;
}

const initialState: IStudentState = {
  student: {
    name: ''
  },
  status: LoadingState.IDLE
}

export const login = createAsyncThunk('student/login', async (name: string): Promise<IStudent> => {
  return {
    name
  }
})

const studentSlices = createSlice({
  name: 'student',
  initialState,
  reducers: {
    logout: (state) => {
      state.student = null
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
        state.student = action.payload
      })
  }
})

export const { logout } = studentSlices.actions
export default studentSlices.reducer
