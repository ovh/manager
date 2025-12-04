import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { useCancelSavingsPlan } from './useSavingsPlan';
import { AppTestWrapper } from '@/__tests__/wrapper';

const serviceId = 4040;
const savingsPlanId = 'fake-savingsPlanId';
const cancelSavingsPlan = vi.fn();

vi.mock('@ovh-ux/manager-core-api');
vi.mocked(v6.post).mockImplementation(cancelSavingsPlan);

describe('Considering useCancelSavingsPlan', () => {
  it('should call good endpoint', async () => {
    const { result } = renderHook(() => useCancelSavingsPlan(), {
      wrapper: AppTestWrapper,
    });

    act(() =>
      result.current.mutate({
        serviceId,
        savingsPlanId,
      }),
    );

    await waitFor(() =>
      expect(cancelSavingsPlan).toHaveBeenCalledWith(
        `/services/${serviceId}/savingsPlans/subscribed/${savingsPlanId}/terminate`,
        {},
      ),
    );
  });
});
