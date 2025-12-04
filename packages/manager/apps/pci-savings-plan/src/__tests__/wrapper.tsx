import React, { PropsWithChildren, ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';

export const AppTestWrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

export const renderWithMockedWrappers = (
  component: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(component, { wrapper: AppTestWrapper, ...options });
