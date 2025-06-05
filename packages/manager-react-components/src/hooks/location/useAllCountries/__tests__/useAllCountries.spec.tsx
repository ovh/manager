import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { shellContext } from '../../../../utils/Test.utils';
import { useAllCountries } from '../useAllCountries';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ShellContext.Provider value={shellContext as unknown as ShellContextType}>
      {children}
    </ShellContext.Provider>
  </QueryClientProvider>
);

describe('useAllCountries', () => {
  it('should return all distinct countries for the available locations', async () => {
    const { result } = renderHook(() => useAllCountries(), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current?.isFetched).toBe(true);
    });
    const { data: countries } = result.current;
    expect(countries).toStrictEqual([
      { code: 'countryCode1', name: 'countryName1' },
      { code: 'countryCode2', name: 'countryName2' },
      { code: 'countryCode3', name: 'countryName3' },
    ]);
  });
});
