import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import React from 'react';

global.React = React;

jest.mock('@ovh-ux/manager-react-shell-client', () => {
  return {
    useOvhTracking: () => ({
      trackCurrentPage: jest.fn(),
      trackClick: jest.fn(),
      trackPage: jest.fn(),
    }),
    PageLocation: {
      page: 'page',
    },
    ButtonType: {
      button: 'button',
      link: 'link',
    },
  };
});
