import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import React from 'react';

global.React = React;

jest.mock('@ovh-ux/manager-react-shell-client', () => ({
  useTracking: jest.fn(() => ({
    trackPage: jest.fn(),
    trackClick: jest.fn(),
  })),
}));
