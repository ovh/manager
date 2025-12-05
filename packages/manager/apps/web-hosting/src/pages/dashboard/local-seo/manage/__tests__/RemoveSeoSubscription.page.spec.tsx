import { useLocation, useParams } from 'react-router-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useHostingDeleteLocation } from '@/data/hooks/webHostingLocalSeo/useWebHostingLocalSeo';
import { wrapper } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

import RemoveSeoSubscriptionModal from '../RemoveSeoSubscription.page';

const mockHostingDeleteLocation = vi.fn();

vi.mock('@/data/hooks/webHostingLocalSeo/useWebHostingLocalSeo', () => ({
  useHostingDeleteLocation: vi.fn(),
}));

describe('RemoveSeoSubscriptionModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({
      serviceName: 'test-service',
      locationId: 'location-123',
    });
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/test',
      search: '',
      hash: '',
      key: '',
      state: {
        address: '123 Test Street',
        companyName: 'Test Company',
        email: 'test@example.com',
      },
    } as ReturnType<typeof useLocation>);
    vi.mocked(useHostingDeleteLocation).mockReturnValue({
      data: undefined,
      variables: undefined,
      error: null,
      isIdle: true,
      isPending: false,
      isError: false,
      isSuccess: false,
      status: 'idle',
      mutate: mockHostingDeleteLocation,
      hostingDeleteLocation: mockHostingDeleteLocation,
    } as unknown as ReturnType<typeof useHostingDeleteLocation>);
  });

  it('should render correctly', () => {
    const { container } = render(<RemoveSeoSubscriptionModal />, { wrapper });
    expect(container).toBeInTheDocument();
  });

  it('should display modal heading', () => {
    render(<RemoveSeoSubscriptionModal />, { wrapper });
    const headings = screen.getAllByText(/hosting_tab_LOCAL_SEO_delete/i);
    expect(headings.length).toBeGreaterThan(0);
  });

  it('should display location details', () => {
    render(<RemoveSeoSubscriptionModal />, { wrapper });
    expect(screen.getByText('Test Company')).toBeInTheDocument();
    expect(screen.getByText('123 Test Street')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('should display undefined address when address is not provided', () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/test',
      search: '',
      hash: '',
      key: '',
      state: {
        companyName: 'Test Company',
        email: 'test@example.com',
      },
    } as ReturnType<typeof useLocation>);

    render(<RemoveSeoSubscriptionModal />, { wrapper });
    expect(screen.getByText(/hosting_tab_LOCAL_SEO_table_value_undefined/i)).toBeInTheDocument();
  });

  it('should close modal on cancel', () => {
    render(<RemoveSeoSubscriptionModal />, { wrapper });
    const cancelBtn = screen.getByTestId('secondary-button');
    fireEvent.click(cancelBtn);
    expect(navigate).toHaveBeenCalled();
  });

  it('should delete location and show success on confirm', async () => {
    render(<RemoveSeoSubscriptionModal />, { wrapper });
    const confirmBtn = screen.getByTestId('primary-button');
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockHostingDeleteLocation).toHaveBeenCalledWith('location-123');
      expect(navigate).toHaveBeenCalled();
    });
  });

  it('should handle delete error', async () => {
    const error = {
      response: {
        data: {
          message: 'Delete failed',
        },
      },
    };
    vi.mocked(useHostingDeleteLocation).mockReturnValue({
      hostingDeleteLocation: (locationId: string) => {
        mockHostingDeleteLocation(locationId);
        // Simulate error callback
        setTimeout(() => {
          const onError = vi.mocked(useHostingDeleteLocation).mock.calls[0]?.[2];
          if (onError) {
            onError(error as never);
          }
        }, 0);
      },
      mutate: mockHostingDeleteLocation,
      isPending: false,
      isError: true,
      isSuccess: false,
    } as unknown as ReturnType<typeof useHostingDeleteLocation>);

    render(<RemoveSeoSubscriptionModal />, { wrapper });
    const confirmBtn = screen.getByTestId('primary-button');
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalled();
    });
  });
});
