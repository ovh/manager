import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as scalingApi from '@/data/api/ai/app/scaling-strategy/scaling-strategy.api';
import { mockedApp } from '@/__tests__/helpers/mocks/app/app';
import { useScalingStrategy } from './useScalingStrategy.hook';
import ai from '@/types/AI';

vi.mock('@/data/api/ai/app/scaling-strategy/scaling-strategy.api', () => ({
  scalingStrategy: vi.fn(),
}));

describe('useScalingStrategy', () => {
  it('should call useScalingStrategy on mutation with data', async () => {
    const projectId = 'projectId';
    const appId = 'appId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    const scalingInput: ai.app.ScalingStrategyInput = {
      fixed: {
        replicas: 1,
      },
    };
    vi.mocked(scalingApi.scalingStrategy).mockResolvedValue(mockedApp);
    const { result } = renderHook(
      () => useScalingStrategy({ onError, onSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    const scalingStratProps = {
      projectId,
      appId,
      scalingStrat: scalingInput,
    };
    result.current.scalingStrategy(scalingStratProps);

    await waitFor(() => {
      expect(scalingApi.scalingStrategy).toHaveBeenCalledWith(
        scalingStratProps,
      );
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
