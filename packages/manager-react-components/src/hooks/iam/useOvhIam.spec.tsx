import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { vitest } from 'vitest';
import { apiClient } from '@ovh-ux/manager-core-api';
import { getAuthorizationCheckUrl, useAuthorizationIam } from './useOvhIam';

vitest.mock('@ovh-ux/manager-core-api', async () => {
  return {
    apiClient: {
      v2: {
        post: vitest.fn(),
      },
    },
  };
});

const Wrapper = ({ children }: React.PropsWithChildren) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('getAuthorizationCheckUrl', () => {
  it('encodes the urn if it contains /', () => {
    expect(getAuthorizationCheckUrl('test/urn')).toBe(
      '/iam/resource/test%2Furn/authorization/check',
    );
  });

  it('Ensure the request is sended if all params is sended', async () => {
    (apiClient.v2.post as jest.Mock).mockClear();
    (apiClient.v2.post as jest.Mock).mockReturnValue(
      Promise.resolve({
        data: {
          urn: 'urn:test',
          authorizedActions: ['read'],
          unauthorizedActions: [] as unknown[],
        },
      }),
    );

    const urn = 'urn:test';
    const actions = ['read'];

    const { result } = renderHook(() => useAuthorizationIam(actions, urn), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(apiClient.v2.post).toHaveBeenCalledTimes(1);
      expect(result.current.isAuthorized).toBe(true);
      expect(apiClient.v2.post).toHaveBeenCalledWith(
        getAuthorizationCheckUrl('urn:test'),
        {
          actions,
        },
      );
    });
  });

  it('Ensure isAuthorized is false if the use has not the authorization', async () => {
    (apiClient.v2.post as jest.Mock).mockClear();
    (apiClient.v2.post as jest.Mock).mockReturnValue(
      Promise.resolve({
        data: {
          urn: 'urn:test',
          authorizedActions: [] as unknown[],
          unauthorizedActions: ['read'],
        },
      }),
    );

    const urn = 'urn:test';
    const actions = ['read'];

    const { result } = renderHook(() => useAuthorizationIam(actions, urn), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(apiClient.v2.post).toHaveBeenCalledTimes(1);
      expect(result.current.isAuthorized).toBe(false);
      expect(apiClient.v2.post).toHaveBeenCalledWith(
        getAuthorizationCheckUrl('urn:test'),
        {
          actions,
        },
      );
    });
  });

  it('Ensure the request is not sended if params is not defined', async () => {
    (apiClient.v2.post as jest.Mock).mockClear();

    const actions = ['read'];

    const { result } = renderHook(
      () => useAuthorizationIam(actions, undefined),
      {
        wrapper: Wrapper,
      },
    );

    await waitFor(() => {
      expect(apiClient.v2.post).toHaveBeenCalledTimes(0);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isAuthorized).toBe(false);
    });
  });
});
