import React, { ComponentType } from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TestPage from './Test.component';
import { createWrapper } from '@/utils/Test.utils';

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});

const Wrappers = ({ children }: { children: React.ReactElement }) => {
  const RouterWrapper = createWrapper();
  return (
    <RouterWrapper>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </RouterWrapper>
  );
};

describe('Test page with MUK V0.4.0', () => {
  it('should pass a basic test', () => {
    render(<TestPage />, { wrapper: Wrappers as ComponentType });
    // BUTTON COMPONENT
    expect(screen.getByText('Click me')).toBeVisible();
    // LINK COMPONENT
    expect(screen.getByText('Google')).toBeVisible();
    // ICON COMPONENT
    const icon = document.querySelector('[data-ods="icon"]');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('role', 'presentation');
  });
});
