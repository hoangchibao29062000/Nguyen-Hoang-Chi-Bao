import coinSaga from 'features/Home/homeSaga';
import { all } from 'redux-saga/effects'

export default function* rootSaga() {
    yield all([coinSaga()])
}