import '@/setupTests';
import React, { PropsWithChildren } from 'react';
import { vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import Modal from './Modal';
import {
  modalContact,
  modalContactArgument,
  modalDocument,
  modalDocumentArgument,
  modalString,
  modalStringArgument,
} from '@/__mocks__/modal';
import { serviceInfo } from '@/__mocks__/serviceInfo';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(() => null),
  Navigate: vi.fn(() => null),
}));

vi.mock('@/hooks/data/query', () => ({
  useGetDomainInformation: vi.fn(() => {
    return {
      isLoading: false,
      data: serviceInfo,
    };
  }),
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
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        data: modalContactArgument,
        actions: true,
      },
    });

    render(<Modal universe="domain" operation={modalContact} />, {
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
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        data: modalDocumentArgument,
        actions: true,
      },
    });
    render(<Modal universe="domain" operation={modalDocument} />, {
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
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        data: modalStringArgument,
        actions: true,
      },
    });
    render(<Modal universe="domain" operation={modalString} />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    const contentModal = screen.getByTestId('input-name');
    expect(contentModal).toBeInTheDocument();
  });
});
