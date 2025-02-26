import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootSaga';
import { createReduxHistoryContext } from 'redux-first-history';
import { createBrowserHistory } from 'history';
import coinReducer from 'features/Home/homeSlice';

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
  history: createBrowserHistory(),
});

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: {
    router: routerReducer,
    coin: coinReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware).concat(routerMiddleware),
});

sagaMiddleware.run(rootSaga);

export const history = createReduxHistory(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
