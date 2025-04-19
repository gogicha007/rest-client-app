import { configureStore, ThunkDispatch, Action } from '@reduxjs/toolkit';
import variablesReducer from './variablesSlice';

export const store = configureStore({
  reducer: {
    variables: variablesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch &
  ThunkDispatch<RootState, unknown, Action<string>>;
