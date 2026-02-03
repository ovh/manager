import { vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { setMockedUseParams } from '@/__tests__/helpers/mockRouterDomHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { useServiceData } from './Service.context';

vi.mock('@/data/api/database/service.api', () => ({
  getService: vi.fn(() => mockedService),
}));

describe('Service context', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    setMockedUseParams({
      projectId: 'projectId',
      category: 'operational',
      serviceId: 'serviceId',
    });
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
