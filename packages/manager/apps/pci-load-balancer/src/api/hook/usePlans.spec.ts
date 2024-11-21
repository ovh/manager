import { renderHook, waitFor } from '@testing-library/react';
import { IMe, useMe } from '@ovh-ux/manager-react-components';
import { vi } from 'vitest';
import { useGetPlans } from './usePlans';
import { getPlans, TPlanResponse } from '../data/plans';
import { wrapper } from '@/wrapperRenders';

vi.mock('../data/plans', () => ({
  getPlans: vi.fn(),
}));

describe('useGetPlans', () => {
  it('should fetch plans when me is available', async () => {
    const mockMe = { ovhSubsidiary: 'US' } as IMe;
    const plansResponse = {
      plans: [{ code: 'Plan 1' }],
    } as TPlanResponse;
    vi.mocked(useMe).mockReturnValue({ me: mockMe });
    vi.mocked(getPlans).mockResolvedValue(plansResponse);

    const { result } = renderHook(() => useGetPlans('project-id'), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(plansResponse);
    expect(getPlans).toHaveBeenCalledWith('project-id', 'US');
  });
});
