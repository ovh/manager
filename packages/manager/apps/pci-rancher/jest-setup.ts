import '@testing-library/jest-dom';
import 'element-internals-polyfill';

jest.mock('@ovh-ux/manager-react-shell-client', () => ({
  useTracking: jest.fn(() => ({
    trackPage: jest.fn(),
    trackClick: jest.fn(),
  })),
}));
