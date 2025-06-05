import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { shellContext } from '../../../../utils/Test.utils';
import { useLocationByName } from '../useLocationByName';
import { location3 } from '../../../../__mocks__/locations';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ShellContext.Provider value={shellContext as unknown as ShellContextType}>
      {children}
    </ShellContext.Provider>
  </QueryClientProvider>
);

describe('useLocationByName', () => {
  it('should return the location for the given name', async () => {
    const { result } = renderHook(() => useLocationByName('name3'), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current?.isFetched).toBe(true);
    });
    const { data: location } = result.current;
    expect(location).toStrictEqual(location3);
  });
});
