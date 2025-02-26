import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toastNoti } from 'helper/toast.helper';

interface IInitialState {
  [key:string]: any;
}

interface ObjectInitialState {
  type: IInitialState
}

const initialState: ObjectInitialState = {
  type: {
    toast: ""
  }
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    commonToast(state, action: PayloadAction<any>) {
      toastNoti(action.payload.message, 400);
    },
  },
});

// Actions
export const commonActions = commonSlice.actions;

// Selectors

// Reducer
const commonReducer = commonSlice.reducer;

export default commonReducer;
