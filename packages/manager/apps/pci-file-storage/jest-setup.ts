import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import React from 'react';

global.React = React;

const mockShellContext = {
  shell: {
    navigation: {
      getURL: jest.fn().mockResolvedValue('mocked-url'),
    },
  },
};

jest.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigation: jest.fn(() => ({
    getURL: jest.fn(() => Promise.resolve('123')),
    data: [],
  })),
  ShellContext: {
    Provider: ({ children }) => children,
    Consumer: ({ children }) => children(mockShellContext),
  },
  useTracking: jest.fn(() => ({
    trackPage: jest.fn(),
    trackClick: jest.fn(),
  })),
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(() => mockShellContext),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
