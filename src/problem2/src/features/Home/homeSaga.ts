import { call, put, takeLatest } from 'redux-saga/effects';
import coinApi from 'api/coinApi';
import { ListDataResponse } from 'models/common';
import { ICoin } from 'models';
import { coinActions } from './homeSlice';
import { commonActions } from 'features/common/commonSlice';
import commonHelper from 'helper/common.helper';

function* handleGetListCoin() {
  try {
    const actionGetListCoin: ListDataResponse<ICoin> = yield call(coinApi.getListCoin);
    if (actionGetListCoin.status >= 400) {
      yield put(coinActions.getListFailed(actionGetListCoin));
    } else {
      yield put(coinActions.getListSuccess(actionGetListCoin));
    }
  } catch (error) {
    yield put(commonActions.commonToast(error));
  }
}


function* handleDepositCoin(action: ReturnType<typeof coinActions.callDepositSuccess>) {
  try {
    yield put(coinActions.depositSuccess({
      message: `Nạp ${action.payload.amount} ${action.payload.symbol} thành công`,
      status: 200
    }));
  } catch (error) {
    yield put(commonActions.commonToast(error));
  }
}

function* handleUnsupport(action: ReturnType<typeof coinActions.callTokenUnsupport>) {
  try {
    yield put(coinActions.tokenUnsupport({
      message: `Chúng tôi xin lỗi, hiện tại $${action.payload.symbol} chưa được hỗ trợ`,
      status: 400
    }));
  } catch (error) {
    yield put(commonActions.commonToast(error));
  }
}

function* handleDuplicateToken(action: ReturnType<typeof coinActions.callDuplicateToken>) {
  try {
    yield put(coinActions.duplicateToken({
      message: `Chúng tôi xin lỗi, không thể chọn $${action.payload.symbol}`,
      status: 400
    }));
  } catch (error) {
    yield put(commonActions.commonToast(error));
  }
}

function* handleSwapToken(action: ReturnType<typeof coinActions.callSwapToken>) {
  try {
    yield put(coinActions.swapToken({
      message: `Swap thành công
      ${commonHelper.formatNumber(Number(action.payload.famount), "", "en-US", 3)} ${action.payload.from.symbol} -> ${commonHelper.formatNumber(Number(action.payload.tamount), "", "en-US", 3)} ${action.payload.to.symbol}
      `,
      status: 200
    }));
  } catch (error) {
    yield put(commonActions.commonToast(error));
  }
}

export default function* coinSaga() {
  //Get
  yield takeLatest(coinActions.callListSuccess.type, handleGetListCoin);

  //POST 
  yield takeLatest(coinActions.callDepositSuccess.type, handleDepositCoin);
  yield takeLatest(coinActions.callTokenUnsupport.type, handleUnsupport);
  yield takeLatest(coinActions.callDuplicateToken.type, handleDuplicateToken);
  yield takeLatest(coinActions.callSwapToken.type, handleSwapToken);
}
