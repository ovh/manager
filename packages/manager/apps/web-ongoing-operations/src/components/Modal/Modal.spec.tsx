import '@/setupTests';
import React, { PropsWithChildren } from 'react';
import { vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Modal from './Modal';
import {
  modalContact,
  modalContactArgument,
  modalDocument,
  modalDocumentArgument,
  modalString,
  modalStringArgument,
} from '@/__mocks__/modal';
import { getmeTaskDomainArgument } from '@/data/api/web-ongoing-operations';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(() => null),
  Navigate: vi.fn(() => null),
}));

vi.mock('@/data/api/web-ongoing-operations', () => ({
  getmeTaskDomainArgument: vi.fn(),
  getmeTaskDomainNicList: vi
    .fn()
    .mockImplementation(() => Promise.resolve(['nic'])),
}));

describe('Modal by argument', () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  const queryClient = new QueryClient();
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('when the modal is contact', async () => {
    vi.mocked(getmeTaskDomainArgument).mockResolvedValue(modalContactArgument);
    render(<Modal universe="domain" data={modalContact} />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    expect(
      screen.getByText('domain_operations_modal_title'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('domain_operations_update_comment'),
    ).toBeInTheDocument();

    const contentModal = screen.getByTestId('contactModal');
    expect(contentModal).toBeInTheDocument();
    expect(contentModal).toHaveAttribute(
      'label',
      'domain_operations_update_nicowner_click_nicowner',
    );
  });

  it('when the modal is document', async () => {
    vi.mocked(getmeTaskDomainArgument).mockResolvedValue(modalDocumentArgument);
    render(<Modal universe="domain" data={modalDocument} />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    const contentModal = screen.getByTestId('documentModal');
    expect(contentModal).toBeInTheDocument();
    expect(contentModal).toHaveAttribute(
      'label',
      'domain_operations_update_nicowner_click_identityEvidence',
    );
  });

  it('when the modal is string', async () => {
    vi.mocked(getmeTaskDomainArgument).mockResolvedValue(modalStringArgument);
    render(<Modal universe="domain" data={modalString} />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    const contentModal = screen.getByTestId('input-name');
    expect(contentModal).toBeInTheDocument();
  });
});
