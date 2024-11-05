import '@testing-library/jest-dom';
import { describe, vi } from 'vitest';
import {
  OdsInputValueChangeEventDetail,
  OsdsInput,
} from '@ovhcloud/ods-components';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PrivateNetworkConfig from './PrivateNetworkConfig.component';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import { NEW_PRIVATE_NETWORK_FORM_SCHEMA } from '../new.constants';
import { NewPrivateNetworkWrapper } from '@/utils/test/test.provider';

vi.mock('@/hooks/useGuideLink/useGuideLink', () => ({
  default: () => ({ VLAN: '' }),
}));
vi.mock('@/hooks/useDefaultVlanID/useDefaultVlanID', () => ({
  default: () => ({ defaultVlanId: 1, notAvailableIds: [2, 10, 300] }),
}));

describe('PrivateNetworkConfig', () => {
  it('should not display define vlanId checkbox when it is LZ', () => {
    render(<PrivateNetworkConfig />, {
      wrapper: ({ children }) => {
        const form = useForm<NewPrivateNetworkForm>({
          defaultValues: {
            isLocalZone: true,
          },
          resolver: zodResolver(NEW_PRIVATE_NETWORK_FORM_SCHEMA),
        });

        return <FormProvider {...form}>{children}</FormProvider>;
      },
    });

    expect(screen.queryByTestId('define-vlan')).not.toBeInTheDocument();
  });

  it('should display error when name is touched and empty', async () => {
    render(<PrivateNetworkConfig />, {
      wrapper: NewPrivateNetworkWrapper,
    });

    fireEvent.click(screen.getByTestId('define-vlan'));

    const input = screen.getByTestId('private-network-name');
    const odsInput = (input as unknown) as OsdsInput;

    act(() => {
      fireEvent.change(input, {
        target: { value: '' },
      });
      fireEvent.blur(input);
      odsInput.odsInputBlur.emit();
    });

    await waitFor(() =>
      expect(screen.getByTestId('private-network-name-error')).toHaveAttribute(
        'error',
        'common:common_field_error_required',
      ),
    );
  });

  it('should display vlanId input with default value when user click on checkbox', () => {
    render(<PrivateNetworkConfig />, {
      wrapper: NewPrivateNetworkWrapper,
    });

    const checkbox = screen.getByTestId('define-vlan');

    fireEvent.click(checkbox);

    const input = screen.getByTestId('vlanId');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(1);
  });

  it('should display warning banner when vlanId is O', async () => {
    render(<PrivateNetworkConfig />, {
      wrapper: NewPrivateNetworkWrapper,
    });

    fireEvent.click(screen.getByTestId('define-vlan'));

    const vlanIdInput = screen.getByTestId('vlanId');
    const odsInput = (vlanIdInput as unknown) as OsdsInput;

    act(() => {
      fireEvent.change(vlanIdInput, {
        target: { value: 0 },
      });

      odsInput.odsValueChange.emit({
        value: '0',
      } as OdsInputValueChangeEventDetail);
    });

    await waitFor(() =>
      expect(
        screen.getByText(
          'pci_projects_project_network_private_create_vlan_id_warning',
        ),
      ).toBeInTheDocument(),
    );
  });

  it('should display warning banner when vlanId is already allocated', () => {
    render(<PrivateNetworkConfig />, {
      wrapper: NewPrivateNetworkWrapper,
    });

    fireEvent.click(screen.getByTestId('define-vlan'));

    const vlanIdInput = screen.getByTestId('vlanId');
    const odsInput = (vlanIdInput as unknown) as OsdsInput;

    act(() => {
      fireEvent.change(vlanIdInput, {
        target: { value: 2 },
      });

      odsInput.odsValueChange.emit({
        value: '2',
      } as OdsInputValueChangeEventDetail);
    });

    expect(
      screen.getByText(
        'new:pci_projects_project_network_private_create_configure_vlan_taken',
      ),
    ).toBeInTheDocument();
  });
});
