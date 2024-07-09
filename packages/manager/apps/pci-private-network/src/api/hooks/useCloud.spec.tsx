import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { useMigrationSteins } from './useCloud';

vi.mock('@ovh-ux/manager-core-api');

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useCloud', () => {
  it('should fetch migration steins ordered by date', async () => {
    const steins = [
      {
        date: new Date(Date.now()),
        zone: 'EU',
        travaux: 'foo',
      },
      {
        date: new Date(Date.now() - 5),
        zone: 'CA',
        travaux: 'bar',
      },
    ];
    vi.mocked(v6.get).mockResolvedValue({ data: steins });
    const { result } = renderHook(() => useMigrationSteins(), { wrapper });
    expect(result.current.isFetching).toBe(true);
    expect(result.current.isPending).toBe(true);
    await waitFor(() => result.current.isSuccess);
    expect(v6.get).toHaveBeenCalledWith('/cloud/migrationStein');
    await waitFor(() => result.current.isFetching === false);
    expect(result.current.isPending).toBe(false);
    expect(result.current.data[0]).toEqual(steins[1]);
    expect(result.current.data[1]).toEqual(steins[0]);
  });
});
