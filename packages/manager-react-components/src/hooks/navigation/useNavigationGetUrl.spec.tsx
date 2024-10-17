// eslint-disable-next-line prettier/prettier
import type { ParamValueType } from '@ovh-ux/url-builder';
import { PropsWithChildren, useState } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNavigationGetUrl } from './useNavigationGetUrl';

const mockGetURL = jest.fn();

const wrapper = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(new QueryClient());
  const [mockContextValue] = useState({
    shell: { navigation: { getURL: mockGetURL } },
  });

  return (
    <ShellContext.Provider value={mockContextValue as never}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ShellContext.Provider>
  );
};

describe('useNavigationGetUrl', () => {
  it('should call navigation.getURL with correct linkParams', async () => {
    const linkParams: [string, string, Record<string, ParamValueType>] = [
      'param1',
      'param2',
      { key: 'value' },
    ];
    mockGetURL.mockResolvedValue('mockedUrl');

    const { result } = renderHook(
      () => useNavigationGetUrl(linkParams, { retry: false }),
      {
        wrapper,
      },
    );

    await waitFor(() => result.current.isSuccess);

    expect(mockGetURL).toHaveBeenCalledWith(...linkParams);
    await waitFor(() => expect(result.current.data).toBe('mockedUrl'));
  });
});
