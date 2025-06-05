import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { shellContext } from '../../../../utils/Test.utils';
import { useAllLocationsByType } from '../useAllLocationsByType';
import { LocationType } from '../useAllLocationsByType.type';
import { locations1AZ } from '../../../../__mocks__/locations';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ShellContext.Provider value={shellContext as unknown as ShellContextType}>
      {children}
    </ShellContext.Provider>
  </QueryClientProvider>
);

describe('useAllLocationsByType', () => {
  it('should return locations matching the given type', async () => {
    const { result } = renderHook(
      () => useAllLocationsByType(LocationType['1AZ']),
      {
        wrapper,
      },
    );
    await waitFor(() => {
      expect(result.current?.isFetched).toBe(true);
    });
    const { data: allLocations } = result.current;
    expect(allLocations).toStrictEqual(locations1AZ);
  });
});
