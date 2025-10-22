import { vitest } from 'vitest';

import { mockGetEnvironment, renderWithContext } from '../../../utils/Test.utils';
import { ErrorBoundary } from '../ErrorBoundary.component';

vitest.mock('react-router-dom', (importOriginal) => ({
  ...importOriginal(),
  useRouteError: vitest.fn(),
  useMatches: () => ({
    pathname: 'vrackServices',
  }),
}));

mockGetEnvironment.mockResolvedValue({
  applicationName: 'test-application',
});

describe('ErrorBoundary Tests', () => {
  beforeEach(() => {
    vitest.clearAllMocks();
  });

  it('should render Error Boundary component when error occurs', () => {
    const { container } = renderWithContext({
      children: <ErrorBoundary redirectionApp="test" />,
    });
    expect(container.firstChild).toMatchSnapshot();
  });
});
