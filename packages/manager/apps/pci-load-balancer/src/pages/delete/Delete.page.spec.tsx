import { act, render } from '@testing-library/react';
import { beforeEach, describe, it, vi } from 'vitest';
import { UseQueryResult } from '@tanstack/react-query';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import userEvent from '@testing-library/user-event';
import DeletePage from '@/pages/delete/Delete.page';
import { wrapper } from '@/wrapperRenders';
import { TLoadBalancer } from '@/api/data/load-balancer';
import { useLoadBalancer } from '@/api/hook/useLoadBalancer';

vi.mock('@/api/hook/useLoadBalancer', async () => {
  const mod = await vi.importActual('@/api/hook/useLoadBalancer');
  return {
    ...mod,
    useLoadBalancer: vi.fn(),
  };
});

const mockedTrackClick = vi.fn();
vi.mocked(useOvhTracking().trackClick).mockImplementation(mockedTrackClick);

describe('DeletePage', () => {
  beforeEach(() => {
    vi.mocked(useLoadBalancer).mockReturnValue({
      data: { id: 'lb1', name: 'Load Balancer 1' },
      isPending: false,
    } as UseQueryResult<TLoadBalancer>);
  });

  it('renders deletion modal with correct title and description', () => {
    const { getByText } = render(<DeletePage />, { wrapper });
    expect(
      getByText('octavia_load_balancer_delete_description'),
    ).toBeInTheDocument();
  });

  it('disables confirm button when pending', () => {
    vi.mocked(useLoadBalancer).mockReturnValue({
      data: { id: 'lb1', name: 'Load Balancer 1' },
      isPending: true,
    } as UseQueryResult<TLoadBalancer>);

    const { getByText } = render(<DeletePage />, { wrapper });
    expect(getByText('octavia_load_balancer_delete_confirm')).toBeDisabled();
  });

  it('should track clicking on confirm', async () => {
    vi.mocked(useLoadBalancer).mockReturnValue({
      data: { id: 'lb1', name: 'Load Balancer 1', region: 'region' },
      isPending: false,
    } as UseQueryResult<TLoadBalancer>);

    const { getByText } = render(<DeletePage />, { wrapper });
    await act(() =>
      userEvent.click(getByText('octavia_load_balancer_delete_confirm')),
    );

    expect(mockedTrackClick).toHaveBeenCalledWith({
      actionType: 'action',
      actions: ['delete_loadbalancer', 'confirm', 'region'],
      buttonType: 'button',
      location: 'pop-up',
    });
  });

  it('should track clicking on cancel', async () => {
    vi.mocked(useLoadBalancer).mockReturnValue({
      data: { id: 'lb1', name: 'Load Balancer 1', region: 'region' },
      isPending: false,
    } as UseQueryResult<TLoadBalancer>);

    const { getByText } = render(<DeletePage />, { wrapper });
    await act(() =>
      userEvent.click(getByText('octavia_load_balancer_delete_cancel')),
    );

    expect(mockedTrackClick).toHaveBeenCalledWith({
      actionType: 'action',
      actions: ['delete_loadbalancer', 'confirm', 'region'],
      buttonType: 'button',
      location: 'pop-up',
    });
  });
});
