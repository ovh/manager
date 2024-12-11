import '@testing-library/jest-dom';
import { describe, vi } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import {
  OdsInputValueChangeEventDetail,
  OsdsInput,
} from '@ovhcloud/ods-components';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import { cidr } from '@/__mocks__/network';
import SubnetConfig from './SubnetConfig.component';
import { NewPrivateNetworkWrapper } from '@/__tests__/wrapper';
import { NEW_PRIVATE_NETWORK_FORM_SCHEMA } from '../new.constants';

vi.mock('@/hooks/useGuideLink/useGuideLink');
vi.mock('@/pages/new/subnet/gateway/GatewayConfig.component');

describe('SubnetConfig CIDR', () => {
  it('should display CIDR with default vlanId when user does not define a vlanId', async () => {
    render(<SubnetConfig />, {
      wrapper: ({ children }) => {
        const form = useForm<NewPrivateNetworkForm>({
          defaultValues: {
            subnet: {
              cidr,
            },
          },
          resolver: zodResolver(NEW_PRIVATE_NETWORK_FORM_SCHEMA),
        });

        return <FormProvider {...form}>{children}</FormProvider>;
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId('private-network-cidr')).toHaveValue(cidr);
    });
  });

  it('should display error when the CIDR is not valid', async () => {
    render(<SubnetConfig />, { wrapper: NewPrivateNetworkWrapper });

    const input = screen.getByTestId('private-network-cidr');
    const odsInput = (input as unknown) as OsdsInput;

    act(() => {
      fireEvent.change(input, {
        target: { value: 'whatever' },
      });

      odsInput.odsValueChange.emit({
        value: 'whatever',
      } as OdsInputValueChangeEventDetail);
    });

    await waitFor(() =>
      expect(
        screen.getByText('new:pci_projects_network_cidr'),
      ).toBeInTheDocument(),
    );
  });
});
