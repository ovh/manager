import { ReactNode } from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Preferences from './preferences.page';

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('preferences page', () => {
  it('displays loading spinner while main request are loading', () => {
    const { getByTestId } = render(<Preferences />, { wrapper });
    expect(getByTestId('listing-page-spinner')).toBeInTheDocument();
  });
});
