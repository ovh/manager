import type { ComponentType, ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ListingTestPage from './ListingTest.page';
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

const Wrappers = ({ children }: { children: ReactElement }): ReactElement => {
  const RouterWrapper = createWrapper();
  return (
    <RouterWrapper>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </RouterWrapper>
  );
};

describe('Listing page', () => {
  it('should render the listing page', () => {
    render(<ListingTestPage />, { wrapper: Wrappers as ComponentType });
    expect(screen.getByText('Listing Test')).toBeInTheDocument();
    expect(screen.getByText('name')).toBeInTheDocument();
  });
});
