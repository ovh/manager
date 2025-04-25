import { vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook/notebook';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedJob } from '@/__tests__/helpers/mocks/job/job';
import { useDashboardData } from './Dashboard.context';
import { mockedApp } from '@/__tests__/helpers/mocks/app/app';

describe('Dashboard context', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          projectId: 'projectId',
        }),
        useOutletContext: vi.fn(() => ({
          notebooks: [mockedNotebook],
          jobs: [mockedJob],
          apps: [mockedApp],
        })),
      };
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return dashoard data when projectId in params', async () => {
    const { result } = renderHook(() => useDashboardData(), {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(result.current.projectId).toBe('projectId');
    expect(result.current.apps).toStrictEqual([mockedApp]);
    expect(result.current.jobs).toStrictEqual([mockedJob]);
    expect(result.current.notebooks).toStrictEqual([mockedNotebook]);
  });
});
