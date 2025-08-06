import { vitest } from 'vitest';
import { ErrorObject } from '../Error.types';
import { mockGetEnvironment, setupSpecTest } from './Error.spec';

mockGetEnvironment.mockResolvedValue({
  applicationName: 'test-application',
});

describe('ErrorBanner Snapshot Tests', () => {
  beforeEach(() => {
    vitest.clearAllMocks();
  });

  it('should match snapshot with default 404 error', () => {
    const defaultError: ErrorObject = {
      status: 404,
      data: { message: 'Service not found' },
      headers: { 'x-ovh-queryid': '123456789' },
    };

    const { container } = setupSpecTest({}, defaultError);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with 401 unauthorized error', () => {
    const unauthorizedError: ErrorObject = {
      status: 401,
      data: { message: 'Unauthorized access' },
      headers: { 'x-ovh-queryid': '987654321' },
    };

    const { container } = setupSpecTest({}, unauthorizedError);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with 500 server error', () => {
    const serverError: ErrorObject = {
      status: 500,
      data: { message: 'Internal server error' },
      headers: { 'x-ovh-queryid': '555666777' },
    };

    const { container } = setupSpecTest({}, serverError);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with error without query ID', () => {
    const errorWithoutQueryId: ErrorObject = {
      status: 404,
      data: { message: 'Page not found' },
      headers: {},
    };

    const { container } = setupSpecTest({}, errorWithoutQueryId);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with error without data message', () => {
    const errorWithoutMessage: ErrorObject = {
      status: 500,
      data: {},
      headers: { 'x-ovh-queryid': '111222333' },
    };

    const { container } = setupSpecTest({}, errorWithoutMessage);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with custom label tracking', () => {
    const error: ErrorObject = {
      status: 404,
      data: { message: 'Custom error message' },
      headers: { 'x-ovh-queryid': '444555666' },
    };

    const { container } = setupSpecTest(
      { labelTracking: 'custom-tracking-label' },
      error,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with custom className', () => {
    const error: ErrorObject = {
      status: 404,
      data: { message: 'Test error' },
      headers: { 'x-ovh-queryid': '777888999' },
    };

    const { container } = setupSpecTest(
      { className: 'custom-error-class' },
      error,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with all props', () => {
    const error: ErrorObject = {
      status: 403,
      data: { message: 'Forbidden access' },
      headers: { 'x-ovh-queryid': '000111222' },
    };

    const onRedirectHome = vitest.fn();
    const onReloadPage = vitest.fn();

    const { container } = setupSpecTest(
      {
        onRedirectHome,
        onReloadPage,
        labelTracking: 'full-props-test',
        className: 'full-test-class',
      },
      error,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with minimal error object', () => {
    const minimalError: ErrorObject = {
      status: 404,
      data: {},
      headers: {},
    };

    const { container } = setupSpecTest({}, minimalError);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with complex error message', () => {
    const complexError: ErrorObject = {
      status: 500,
      data: {
        message:
          'This is a very long error message that might contain special characters like é, ñ, or symbols like @#$%^&*() and should be displayed properly in the error banner component',
      },
      headers: { 'x-ovh-queryid': 'complex123' },
    };

    const { container } = setupSpecTest({}, complexError);

    expect(container.firstChild).toMatchSnapshot();
  });
});
