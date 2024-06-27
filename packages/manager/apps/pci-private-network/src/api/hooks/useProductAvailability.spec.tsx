import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { useProductAvailability } from './useProductAvailability';

vi.mock('@ovh-ux/manager-core-api');

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useProductAvailability', () => {
  it('should fetch project product plans', async () => {
    const projectId = '123';
    const ovhSubsidiary = 'foo';
    const planCode = 'abc';
    const plans = [];
    vi.mocked(v6.get).mockResolvedValue({ data: { plans } });
    const { result } = renderHook(
      () => useProductAvailability(projectId, ovhSubsidiary, planCode),
      { wrapper },
    );
    expect(result.current.isFetching).toBe(true);
    expect(result.current.isPending).toBe(true);
    await waitFor(() => result.current.isSuccess);
    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/capabilities/productAvailability`,
      {
        params: { ovhSubsidiary, planCode },
      },
    );
    await waitFor(() => result.current.isFetching === false);
    expect(result.current.isPending).toBe(false);
    expect(result.current.data).toBe(plans);
  });
});
