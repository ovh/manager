import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { vi } from 'vitest';
import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

const queryClient = new QueryClient();

export const mockShellContext = {
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

export const wrapper = ({ children }: { children: React.ReactNode }) => {
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
