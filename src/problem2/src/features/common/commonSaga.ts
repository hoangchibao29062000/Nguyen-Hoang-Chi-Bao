import { fork } from "redux-saga/effects";

function* serverFlow() {
  
}

export default function* ServerSaga() {
  yield fork(serverFlow);
}
