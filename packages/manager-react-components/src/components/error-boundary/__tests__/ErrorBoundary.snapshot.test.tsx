import { vitest } from 'vitest';
import { ErrorObject } from '../../error/Error.types';
import {
  mockGetEnvironment,
  setupSpecTest,
} from '../../error/__tests__/Error.spec';

mockGetEnvironment.mockResolvedValue({
  applicationName: 'test-application',
});

describe('ErrorBoundary Tests', () => {
  beforeEach(() => {
    vitest.clearAllMocks();
  });

  it('should render Error component when error occurs', () => {
    const defaultError: ErrorObject = {
      status: 404,
      data: { message: 'Service not found' },
      headers: { 'x-ovh-queryid': '123456789' },
    };
    const { container } = setupSpecTest({}, defaultError);

    expect(container.firstChild).toMatchSnapshot();
  });
});
