import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import React from 'react';

global.React = React;

jest.mock('@ovh-ux/manager-react-shell-client', () => ({
  useOvhTracking: jest.fn(() => ({
    trackCurrentPage: jest.fn(),
    trackClick: jest.fn(),
    trackPage: jest.fn(),
  })),
}));
