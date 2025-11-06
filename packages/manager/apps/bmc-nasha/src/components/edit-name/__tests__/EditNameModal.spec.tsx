import React, { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { putJSON } from '@/data/api/Client.api';
import type { Nasha } from '@/types/Dashboard.type';

import { EditNameModal } from '../EditNameModal.component';

// Mock dependencies
vi.mock('@/data/api/Client.api', () => ({
  putJSON: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string>) => {
      if (params?.name) {
        return `${key} ${params.name}`;
      }
      return key;
    },
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('EditNameModal', () => {
  const mockNasha: Nasha = {
    serviceName: 'nasha-test-1',
    customName: 'My Nasha',
    datacenter: 'rbx',
    localeDatacenter: 'Roubaix',
    diskType: 'ssd',
    diskSize: '1000 GB',
    zpoolSize: 1000,
    monitored: true,
    use: {
      size: { value: 1000, unit: 'GB', name: 'Taille' },
      used: { value: 500, unit: 'GB', name: 'Stockage' },
      usedbysnapshots: { value: 100, unit: 'GB', name: 'Snapshots' },
    },
  };

  const mockNashaApiUrl = '/dedicated/nasha/nasha-test-1';
  const onClose = vi.fn();
  const onSuccess = vi.fn();
  const onError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('should render modal with current custom name', () => {
    render(
      <EditNameModal
        nasha={mockNasha}
        nashaApiUrl={mockNashaApiUrl}
        onClose={onClose}
        onSuccess={onSuccess}
        onError={onError}
      />,
      { wrapper },
    );

    expect(screen.getByText(/edit_name.title/)).toBeInTheDocument();
    const input = screen.getByDisplayValue('My Nasha');
    expect(input).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', () => {
    render(
      <EditNameModal
        nasha={mockNasha}
        nashaApiUrl={mockNashaApiUrl}
        onClose={onClose}
      />,
      { wrapper },
    );

    const cancelButton = screen.getByText('edit_name.cancel');
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should validate and submit new name', async () => {
    vi.mocked(putJSON).mockResolvedValue({} as any);

    render(
      <EditNameModal
        nasha={mockNasha}
        nashaApiUrl={mockNashaApiUrl}
        onClose={onClose}
        onSuccess={onSuccess}
        onError={onError}
      />,
      { wrapper },
    );

    const input = screen.getByDisplayValue('My Nasha');
    fireEvent.change(input, { target: { value: 'New Name' } });

    const submitButton = screen.getByText('edit_name.confirm');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(putJSON).toHaveBeenCalledWith('v6', mockNashaApiUrl, {
        customName: 'New Name',
      });
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('should show error when name contains invalid characters', () => {
    render(
      <EditNameModal
        nasha={mockNasha}
        nashaApiUrl={mockNashaApiUrl}
        onClose={onClose}
        onError={onError}
      />,
      { wrapper },
    );

    const input = screen.getByDisplayValue('My Nasha');
    fireEvent.change(input, { target: { value: 'Name <invalid>' } });

    const submitButton = screen.getByText('edit_name.confirm');
    fireEvent.click(submitButton);

    expect(putJSON).not.toHaveBeenCalled();
    expect(screen.getByText('edit_name.forbid')).toBeInTheDocument();
  });

  it('should show error when name is same as serviceName', () => {
    render(
      <EditNameModal
        nasha={mockNasha}
        nashaApiUrl={mockNashaApiUrl}
        onClose={onClose}
        onError={onError}
      />,
      { wrapper },
    );

    const input = screen.getByDisplayValue('My Nasha');
    fireEvent.change(input, { target: { value: mockNasha.serviceName } });

    const submitButton = screen.getByText('edit_name.confirm');
    fireEvent.click(submitButton);

    expect(putJSON).not.toHaveBeenCalled();
    expect(screen.getByText(/edit_name.forbid/)).toBeInTheDocument();
  });

  it('should handle API errors', async () => {
    const mockError = new Error('API Error');
    vi.mocked(putJSON).mockRejectedValue(mockError);

    render(
      <EditNameModal
        nasha={mockNasha}
        nashaApiUrl={mockNashaApiUrl}
        onClose={onClose}
        onError={onError}
      />,
      { wrapper },
    );

    const input = screen.getByDisplayValue('My Nasha');
    fireEvent.change(input, { target: { value: 'New Name' } });

    const submitButton = screen.getByText('edit_name.confirm');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(mockError);
    });
  });
});

