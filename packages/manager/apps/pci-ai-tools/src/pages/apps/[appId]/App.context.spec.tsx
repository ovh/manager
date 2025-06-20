import { vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedApp } from '@/__tests__/helpers/mocks/app/app';
import { useAppData } from './App.context';

describe('App context', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          projectId: 'projectId',
          appId: 'appId',
        }),
      };
    });

    vi.mock('@/data/api/ai/app/app.api', () => ({
      getApp: vi.fn(() => mockedApp),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return app data when projectId in params', async () => {
    const { result } = renderHook(() => useAppData(), {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(result.current.projectId).toBe('projectId');
  });
});
