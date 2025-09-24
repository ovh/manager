import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { vi } from 'vitest';
import {
  createMemoryRouter,
  MemoryRouter,
  Route,
  RouterProvider,
  Routes,
} from 'react-router-dom';
import React from 'react';

export const shellContext = {
  environment: {
    getUser: () => ({ ovhSubsidiary: 'mocked_ovhSubsidiary' }),
  },
  shell: {
    navigation: {
      getURL: vi.fn(),
    },
    tracking: {
      trackPage: vi.fn(),
      trackClick: vi.fn(),
    },
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});

export const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ShellContext.Provider
      value={(shellContext as unknown) as ShellContextType}
    >
      {children}
    </ShellContext.Provider>
  </QueryClientProvider>
);

export const mockShellContext = {
  environment: {
    getRegion: vi.fn().mockReturnValue('EU'),
    getUser: vi.fn().mockReturnValue({ ovhSubsidiary: 'mocked_ovhSubsidiary' }),
    getApplication: vi.fn(),
  },
  shell: {
    environment: {
      getRegion: vi.fn().mockReturnValue('EU'),
      getUser: vi.fn().mockReturnValue({}),
      getApplication: vi.fn(),
    },
    navigation: {
      getURL: vi.fn(),
    },
    tracking: {
      trackPage: vi.fn(),
      trackClick: vi.fn(),
    },
  },
};

export const wrapperShow = ({ children }: { children: React.ReactNode }) => {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: children,
        handle: {
          crumb: () => 'Home',
        },
      },
    ],
    {
      initialEntries: ['/'],
      future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      } as any,
    },
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider value={mockShellContext as any}>
        <RouterProvider router={router} />
      </ShellContext.Provider>
    </QueryClientProvider>
  );
};

export const wrapperOffsiteReplication = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <QueryClientProvider client={queryClient}>
    <ShellContext.Provider value={mockShellContext as any}>
      {children}
    </ShellContext.Provider>
  </QueryClientProvider>
);
export const replicationTestWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <MemoryRouter initialEntries={['/project/storage/container/replication/add']}>
    <QueryClientProvider client={new QueryClient()}>
      <ShellContext.Provider value={mockShellContext as any}>
        <Routes>
          <Route
            path="/project/storage/:storageId/replication/add"
            element={children}
          />
        </Routes>
      </ShellContext.Provider>
    </QueryClientProvider>
  </MemoryRouter>
);
