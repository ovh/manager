import { vitest } from 'vitest';

import { mockGetEnvironment } from '@/commons/tests-utils/Mock.utils';
import { renderWithContext } from '@/commons/tests-utils/Render.utils';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary.component';

vitest.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useRouteError: vitest.fn(),
    useMatches: () => ({
      pathname: 'vrackServices',
    }),
  };
});

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
