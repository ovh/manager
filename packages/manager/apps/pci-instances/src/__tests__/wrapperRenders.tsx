import { PropsWithChildren, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';

const shellContext = {
  environment: {
    getUser: vi.fn().mockReturnValue({ ovhSubsidiary: 'FR' }),
  },
};

export const AppTestWrapper = ({ children }: PropsWithChildren) => (
  <ShellContext.Provider value={(shellContext as unknown) as ShellContextType}>
    <MemoryRouter>
      <QueryClientProvider client={new QueryClient()}>
        {children}
      </QueryClientProvider>
    </MemoryRouter>
  </ShellContext.Provider>
);

export const renderWithMockedWrappers = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AppTestWrapper, ...options });
