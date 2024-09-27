import * as zustand from 'zustand';
import { act } from '@testing-library/react';
import { vi } from 'vitest';

/**
 * Zustand mock functions from https://zustand.docs.pmnd.rs/guides/testing#vitest
 * These lines allow to:
 * - run tests that use 'createStore' curried function
 * - clear stores after each test
 * Warning: to work with vitest, this file must be under __mocks__ folder in the root project (.)
 * */
const {
  create: actualCreate,
  createStore: actualCreateStore,
} = await vi.importActual<typeof zustand>('zustand');

export const storeResetFns = new Set<() => void>();

const createUncurried = <T>(stateCreator: zustand.StateCreator<T>) => {
  const store = actualCreate(stateCreator);
  const initialState = store.getInitialState();
  storeResetFns.add(() => {
    store.setState(initialState, true);
  });
  return store;
};

export const create = (<T>(stateCreator: zustand.StateCreator<T>) => {
  return typeof stateCreator === 'function'
    ? createUncurried(stateCreator)
    : createUncurried;
}) as typeof zustand.create;

const createStoreUncurried = <T>(stateCreator: zustand.StateCreator<T>) => {
  const store = actualCreateStore(stateCreator);
  const initialState = store.getInitialState();
  storeResetFns.add(() => {
    store.setState(initialState, true);
  });
  return store;
};

export const createStore = (<T>(stateCreator: zustand.StateCreator<T>) => {
  return typeof stateCreator === 'function'
    ? createStoreUncurried(stateCreator)
    : createStoreUncurried;
}) as typeof zustand.createStore;

afterEach(() => {
  act(() => {
    storeResetFns.forEach((resetFn) => {
      resetFn();
    });
  });
});
