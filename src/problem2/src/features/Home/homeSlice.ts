import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toastNoti } from 'helper/toast.helper';
import { ICoin, ICoinState, IWallet } from 'models';
import { DataResponse, ListDataResponse } from 'models/common';

const initialState: ICoinState = {
  success: true,
  listCoin: [],
};

const coinSlice = createSlice({
  name: 'coin',
  initialState,
  reducers: {
    callListSuccess(state) { },
    getListSuccess(state, action: PayloadAction<ListDataResponse<ICoin>>) {
      state.listCoin = action.payload.data;
      // toastNoti(action.payload.message, 200);
    },
    getListFailed(state, action: PayloadAction<ListDataResponse<ICoin>>) {
      state.success = false;
      toastNoti(action.payload.message, 400);
    },

    callDepositSuccess(state, action: PayloadAction<IWallet>) {
    },
    depositSuccess(state, action: PayloadAction<DataResponse<IWallet>>) {
      toastNoti(action.payload.message, 200);
    },

    callTokenUnsupport(state, action: PayloadAction<IWallet>) { },
    tokenUnsupport(state, action: PayloadAction<DataResponse<IWallet>>) {
      toastNoti(action.payload.message, 400);
    },

    callDuplicateToken(state, action: PayloadAction<IWallet>) { },
    duplicateToken(state, action: PayloadAction<DataResponse<IWallet>>) {
      toastNoti(action.payload.message, 400);
    },

    callSwapToken(state, action: PayloadAction<any>) { },
    swapToken(state, action: PayloadAction<DataResponse<any>>) {
      toastNoti(action.payload.message, 200);
    },
  },

});

// Actions
export const coinActions = coinSlice.actions;

// Selectors
export const selectIsSignIn = (state: any) => state.coin.success;

// Reducer
const coinReducer = coinSlice.reducer;

export default coinReducer;
