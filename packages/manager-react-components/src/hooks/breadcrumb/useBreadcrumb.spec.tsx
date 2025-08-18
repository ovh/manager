import React from 'react';
import { vitest } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { useBreadcrumb } from './useBreadcrumb';

const shellContext = {
  environment: {
    getUser: () => ({ ovhSubsidiary: 'mocked_ovhSubsidiary' }),
  },
  shell: {
    navigation: {
      getURL: vitest.fn(),
    },
  },
};

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <ShellContext.Provider value={shellContext as unknown as ShellContextType}>
      {children}
    </ShellContext.Provider>
  </QueryClientProvider>
);

vitest.mock('@tanstack/react-query', async () => {
  const originalModule = await vitest.importActual('@tanstack/react-query');
  return {
    ...originalModule,
    useQuery: vitest.fn(),
  };
});

describe('useBreadcrumb', () => {
  it('should return an array of breadcrumb item', async () => {
    beforeEach(() => {
      vitest.mock('react-router-dom', async () => ({
        ...(await vitest.importActual('react-router-dom')),
        useLocation: () => ({
          pathname: 'vrackServices',
        }),
      }));
    });
    const { result } = renderHook(
      () =>
        useBreadcrumb({
          rootLabel: 'vRack services',
          appName: 'vrack-services',
        }),
      {
        wrapper,
      },
    );
    const { current } = result;
    await waitFor(() => {
      expect(current?.[0]?.label).toBe('vrackServices');
      expect(current?.[0]?.href).toBe('/#/vrack-services/vrackServices');
    });
  });
});
describe('useBreadcrumb', () => {
  beforeEach(() => {
    vitest.mock('react-router-dom', async () => ({
      ...(await vitest.importActual('react-router-dom')),
      useLocation: () => ({
        pathname: 'vrackServices/789789789/listing',
      }),
    }));
  });
  it('should return an array with 3 breadcrumb items', async () => {
    const { result } = renderHook(
      () =>
        useBreadcrumb({
          rootLabel: 'vRack services',
          appName: 'vrack-services',
        }),
      {
        wrapper,
      },
    );
    const { current } = result;
    await waitFor(() => {
      expect(current?.[0]?.label).toBe('vrackServices');
      expect(current?.[0]?.href).toBe('/#/vrack-services/vrackServices');
      expect(current?.[1]?.label).toBe('789789789');
      expect(current?.[1]?.href).toBe(
        '/#/vrack-services/vrackServices/789789789',
      );
      expect(current?.[2]?.label).toBe('listing');
      expect(current?.[2]?.href).toBe(
        '/#/vrack-services/vrackServices/789789789/listing',
      );
    });
  });
  it('should hide rootLabel', async () => {
    const hook = renderHook(
      () =>
        useBreadcrumb({
          rootLabel: 'vRack services',
          appName: 'vrack-services',
          hideRootLabel: true,
        }),
      {
        wrapper,
      },
    );
    await waitFor(() => {
      expect(hook.result.current?.[0]?.hideLabel).toBeTruthy();
      expect(hook.result.current?.[1]?.hideLabel).toBeFalsy();
      expect(hook.result.current?.[2]?.hideLabel).toBeFalsy();
    });
  });
});
