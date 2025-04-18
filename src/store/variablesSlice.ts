import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Variable {
  key: string;
  value: string;
}

export interface VariablesState {
  variables: Variable[];
}

const initialState: VariablesState = {
  variables: [],
};

const variablesSlice = createSlice({
  name: 'variables',
  initialState,
  reducers: {
    setVariables: (state, action: PayloadAction<Variable[]>) => {
      state.variables = action.payload;
    },
    addVariable: (state, action: PayloadAction<Variable>) => {
      action.payload.key = action.payload.key.trim();
      const existingIndex = state.variables.findIndex(
        (v) => v.key === action.payload.key
      );
      if (existingIndex !== -1) {
        state.variables[existingIndex].value = action.payload.value;
      } else {
        state.variables.push(action.payload);
      }
    },
    removeVariable: (state, action: PayloadAction<string>) => {
      state.variables = state.variables.filter((v) => v.key !== action.payload);
    },
  },
});

export const { setVariables, addVariable, removeVariable } =
  variablesSlice.actions;

export const selectVariables = (state: { variables: VariablesState }) =>
  state.variables.variables;

export default variablesSlice.reducer;
