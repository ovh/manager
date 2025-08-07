import { vitest } from 'vitest';
import { Error } from '../Error.component';
import { ErrorObject } from '../Error.props';
import {
  mockGetEnvironment,
  renderWithContext,
} from '../../../utils/Test.utils';

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
    const { container } = renderWithContext({
      children: <Error error={defaultError} />,
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with 401 unauthorized error', () => {
    const unauthorizedError: ErrorObject = {
      status: 401,
      data: { message: 'Unauthorized access' },
      headers: { 'x-ovh-queryid': '987654321' },
    };
    const { container } = renderWithContext({
      children: <Error error={unauthorizedError} />,
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with 500 server error', () => {
    const serverError: ErrorObject = {
      status: 500,
      data: { message: 'Internal server error' },
      headers: { 'x-ovh-queryid': '555666777' },
    };
    const { container } = renderWithContext({
      children: <Error error={serverError} />,
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with error without query ID', () => {
    const errorWithoutQueryId: ErrorObject = {
      status: 404,
      data: { message: 'Page not found' },
      headers: {},
    };
    const { container } = renderWithContext({
      children: <Error error={errorWithoutQueryId} />,
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with error without data message', () => {
    const errorWithoutMessage: ErrorObject = {
      status: 500,
      data: {},
      headers: { 'x-ovh-queryid': '111222333' },
    };
    const { container } = renderWithContext({
      children: <Error error={errorWithoutMessage} />,
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with custom label tracking', () => {
    const error: ErrorObject = {
      status: 404,
      data: { message: 'Custom error message' },
      headers: { 'x-ovh-queryid': '444555666' },
    };
    const { container } = renderWithContext({
      children: <Error error={error} labelTracking="custom-tracking-label" />,
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with custom className', () => {
    const error: ErrorObject = {
      status: 404,
      data: { message: 'Test error' },
      headers: { 'x-ovh-queryid': '777888999' },
    };
    const { container } = renderWithContext({
      children: <Error error={error} className="custom-error-class" />,
    });
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
    const { container } = renderWithContext({
      children: (
        <Error
          error={error}
          onRedirectHome={onRedirectHome}
          onReloadPage={onReloadPage}
          labelTracking="full-props-test"
          className="full-test-class"
        />
      ),
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with minimal error object', () => {
    const minimalError: ErrorObject = {
      status: 404,
      data: {},
      headers: {},
    };
    const { container } = renderWithContext({
      children: <Error error={minimalError} />,
    });
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
    const { container } = renderWithContext({
      children: <Error error={complexError} />,
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with null error', () => {
    const { container } = renderWithContext({
      children: <Error error={null} />,
    });
    expect(container.firstChild).toMatchSnapshot();
  });
});
