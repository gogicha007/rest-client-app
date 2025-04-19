import { AppDispatch, RootState } from './store';
import { setVariables, addVariable, removeVariable } from './variablesSlice';

export const loadVariablesFromLocalStorage = () => (dispatch: AppDispatch) => {
  const storedVariables = localStorage.getItem('variables');
  if (storedVariables) {
    const parsedVariables = JSON.parse(storedVariables);
    dispatch(setVariables(parsedVariables));
  }
};

export const saveVariableToLocalStorage =
  (variable: { key: string; value: string }) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(addVariable(variable));
    const { variables } = getState().variables;
    localStorage.setItem('variables', JSON.stringify(variables));
  };

export const removeVariableFromLocalStorage =
  (key: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(removeVariable(key));
    const { variables } = getState().variables;
    localStorage.setItem('variables', JSON.stringify(variables));
  };
