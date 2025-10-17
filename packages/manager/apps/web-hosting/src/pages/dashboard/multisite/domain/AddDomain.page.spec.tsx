import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { navigate } from '@/utils/test.setup';

import AddDomainModal from './AddDomain.page';

vi.mock('@/utils/validator', () => ({
  isValidDomain: vi.fn(() => true),
}));

const queryClient = new QueryClient();

describe('AddDomainModal', () => {
  it('renders modal and step 0 by default', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddDomainModal />
      </QueryClientProvider>,
    );
    expect(screen.getByTestId('modal')).not.toBeNull();
    expect(screen.getByText('hosting_add_title')).not.toBeNull();
    expect(screen.getByText('hosting_add_step1_title')).not.toBeNull();
  });

  it('disables next button if domain is not selected in step 0', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddDomainModal />
      </QueryClientProvider>,
    );
    const nextBtn = screen.getByTestId('button-next');
    expect(nextBtn.getAttribute('is-disabled')).toBe('true');
  });

  it('disables previous button on first step', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddDomainModal />
      </QueryClientProvider>,
    );
    const prevBtn = screen.getByTestId('button-previous');
    expect(prevBtn.getAttribute('is-disabled')).toBe('true');
  });

  it('calls closeModal when cancel button is clicked', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddDomainModal />
      </QueryClientProvider>,
    );
    fireEvent.click(screen.getByTestId('button-cancel'));
    expect(navigate).toHaveBeenCalled();
  });
});
