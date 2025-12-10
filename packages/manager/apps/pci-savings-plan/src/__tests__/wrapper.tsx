import React, { PropsWithChildren, ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions, RenderResult } from '@testing-library/react';

export const AppTestWrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

export const renderWithMockedWrappers = (
  component: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): RenderResult => render(component, { wrapper: AppTestWrapper, ...options });
