import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { Variables } from './Variables';
import variablesReducer, {
  VariablesState,
  setVariables,
} from '@/store/variablesSlice';
import * as variablesThunks from '@/store/variablesThunks';

export const createTestStore = (preloadedState?: {
  variables: VariablesState;
}) =>
  configureStore({
    reducer: {
      variables: variablesReducer,
    },
    preloadedState,
  });

jest
  .spyOn(variablesThunks, 'loadVariablesFromLocalStorage')
  .mockImplementation(() => (dispatch) => {
    dispatch(
      setVariables([
        { key: 'API_KEY', value: '123456' },
        { key: 'BASE_URL', value: 'https://example.com' },
      ])
    );
  });

describe('Variables component', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore({
      variables: {
        variables: [
          { key: 'API_KEY', value: '123456' },
          { key: 'BASE_URL', value: 'https://example.com' },
        ],
      },
    });

    jest
      .spyOn(variablesThunks, 'saveVariableToLocalStorage')
      .mockImplementation(() => () => {});
    jest
      .spyOn(variablesThunks, 'removeVariableFromLocalStorage')
      .mockImplementation(() => () => {});
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <Variables />
      </Provider>
    );

  it('renders input fields and button', () => {
    renderComponent();
    expect(screen.getByPlaceholderText('Key...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Data...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('displays variables from state', async () => {
    renderComponent();

    expect(await screen.findByText('API_KEY')).toBeInTheDocument();
    expect(await screen.findByText('123456')).toBeInTheDocument();
    expect(await screen.findByText('BASE_URL')).toBeInTheDocument();
    expect(await screen.findByText('https://example.com')).toBeInTheDocument();
  });

  it('adds a new variable when Add is clicked', () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Key...'), {
      target: { value: 'TOKEN' },
    });
    fireEvent.change(screen.getByPlaceholderText('Data...'), {
      target: { value: 'abcdef' },
    });

    const addButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(addButton);

    expect(variablesThunks.saveVariableToLocalStorage).toHaveBeenCalledWith({
      key: 'TOKEN',
      value: 'abcdef',
    });
  });

  it('removes a variable when trash button is clicked', () => {
    renderComponent();
    const deleteButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.querySelector('svg'));
    fireEvent.click(deleteButtons[0]);

    expect(variablesThunks.removeVariableFromLocalStorage).toHaveBeenCalledWith(
      'API_KEY'
    );
  });

  it('loads variables from localStorage on mount', () => {
    renderComponent();
    expect(variablesThunks.loadVariablesFromLocalStorage).toHaveBeenCalled();
  });
});
