import { vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { useServiceData } from './Service.context';

describe('Service context', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          projectId: 'projectId',
          category: 'operational',
          serviceId: 'serviceId',
        }),
      };
    });
    vi.mock('@/data/api/database/service.api', () => ({
      getService: vi.fn(() => mockedService),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return service data when projectId in params', async () => {
    const { result } = renderHook(() => useServiceData(), {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(result.current.projectId).toBe('projectId');
    expect(result.current.category).toBe('operational');
  });
});
