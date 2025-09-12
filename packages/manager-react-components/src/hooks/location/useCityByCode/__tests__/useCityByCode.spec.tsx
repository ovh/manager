import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { shellContext } from '../../../../utils/Test.utils';
import { useCityByCode } from '../useCityByCode';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ShellContext.Provider value={shellContext as unknown as ShellContextType}>
      {children}
    </ShellContext.Provider>
  </QueryClientProvider>
);

describe('useCityByCode', () => {
  it('should return the city name for the given city code', async () => {
    const { result } = renderHook(() => useCityByCode('cityCode1'), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current?.isFetched).toBe(true);
    });
    const { data: city } = result.current;
    expect(city).toStrictEqual('cityName1');
  });
});
