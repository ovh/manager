import React from 'react';
import { vitest } from 'vitest';
import { renderHook } from '@testing-library/react';
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
    useNavigation: {
      getURL: vitest.fn(),
    },
  },
};

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
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
    expect(current[0].label).toBe('vrackServices');
    expect(current[0].href).toBe('/#/vrack-services/vrackServices');
  });
});

describe('useBreadcrumb', () => {
  it('should return an array of breadcrumb item without test label', async () => {
    beforeEach(() => {
      vitest.mock('react-router-dom', async () => ({
        ...(await vitest.importActual('react-router-dom')),
        useLocation: () => ({
          pathname: 'vrackServices/test',
        }),
      }));
    });
    const { result } = renderHook(
      () =>
        useBreadcrumb({
          rootLabel: 'vRack services',
          appName: 'vrack-services',
          ignoredLabel: ['test'],
        }),
      {
        wrapper,
      },
    );
    const { current } = result;
    expect(current.length).toBe(3);
    expect(current[0].label).toBe('vrackServices');
    expect(current[0].href).toBe('/#/vrack-services/vrackServices');
    expect(current[1].label).toBe('789789789');
    expect(current[1].href).toBe('/#/vrack-services/789789789');
    expect(current[2].label).toBe('listing');
    expect(current[2].href).toBe('/#/vrack-services/listing');
  });
});

describe('useBreadcrumb', () => {
  it('should return an array with 3 breadcrumb items', async () => {
    beforeEach(() => {
      vitest.mock('react-router-dom', async () => ({
        ...(await vitest.importActual('react-router-dom')),
        useLocation: () => ({
          pathname: 'vrackServices/789789789/listing',
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
    expect(current.length).toBe(3);
    expect(current[0].label).toBe('vrackServices');
    expect(current[0].href).toBe('/#/vrack-services/vrackServices');
    expect(current[1].label).toBe('789789789');
    expect(current[1].href).toBe('/#/vrack-services/789789789');
    expect(current[2].label).toBe('listing');
    expect(current[2].href).toBe('/#/vrack-services/listing');
  });
});
