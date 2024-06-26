import { act, fireEvent, render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { SubnetModal } from './SubnetModal';
import { useNewGatewayStore } from '@/pages/add/useStore';

vi.mock('@/pages/add/useStore', () => ({
  useNewGatewayStore: vi.fn(),
}));

describe('SubnetModal', () => {
  it('calls onClose when cancel button is clicked', () => {
    const onClose = vi.fn();
    vi.mocked(useNewGatewayStore).mockReturnValue({
      form: {
        newNetwork: {
          name: '',
          subnet: '',
        },
      },
      updateForm: {
        newNetwork: vi.fn(),
        network: vi.fn(),
      },
    });

    const { getByText } = render(<SubnetModal onClose={onClose} />);
    act(() => {
      fireEvent.click(
        getByText(
          'pci_projects_project_public_gateways_add_modal_cancel_label',
        ),
      );
    });
    expect(onClose).toHaveBeenCalled();
  });

  it('updates network when submit button is clicked and form is valid', () => {
    const onClose = vi.fn();
    const updateNetwork = vi.fn();
    vi.mocked(useNewGatewayStore).mockReturnValue({
      form: {
        newNetwork: {
          name: 'test',
          subnet: 'test',
        },
        network: {
          subnetId: 'subnetId',
        },
      },
      updateForm: {
        newNetwork: vi.fn(),
        network: updateNetwork,
      },
    });

    const { getByText } = render(<SubnetModal onClose={onClose} />);
    act(() => {
      fireEvent.click(
        getByText(
          'pci_projects_project_public_gateways_add_modal_submit_label',
        ),
      );
    });
    expect(updateNetwork).toHaveBeenCalledWith('new', 'subnetId');
  });

  it('does not update network when submit button is clicked and form is invalid', () => {
    const onClose = vi.fn();
    const updateNetwork = vi.fn();
    vi.mocked(useNewGatewayStore).mockReturnValue({
      form: {
        newNetwork: {
          name: '',
          subnet: '',
        },
        network: {
          subnetId: '',
        },
      },
      updateForm: {
        newNetwork: vi.fn(),
        network: updateNetwork,
      },
    });

    const { getByText } = render(<SubnetModal onClose={onClose} />);
    act(() => {
      fireEvent.click(
        getByText(
          'pci_projects_project_public_gateways_add_modal_submit_label',
        ),
      );
    });
    expect(updateNetwork).not.toHaveBeenCalled();
  });
});
