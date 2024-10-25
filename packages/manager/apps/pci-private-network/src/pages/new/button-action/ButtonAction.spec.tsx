import '@testing-library/jest-dom';
import { describe, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import ButtonAction from './ButtonAction.component';
import { NewPrivateNetworkWrapper } from '@/utils/test/test.provider';
import { cidr } from '@/__mocks__/network';
import { NEW_PRIVATE_NETWORK_FORM_SCHEMA } from '../new.constants';

vi.mock('@ovh-ux/manager-pci-common', () => ({
  useProject: vi.fn().mockReturnValue({ data: { project_id: 'project_id' } }),
  isDiscoveryProject: vi.fn().mockReturnValue(false),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => ({ navigate: vi.fn() }),
}));

vi.mock('@/data/hooks/networks/useNetworks', () => ({
  useCheckPrivateNetworkCreationStatus: () => ({ mutateAsync: vi.fn() }),
}));

describe('ButtonAction', () => {
  it('should disabled button when region is not selected', () => {
    render(<ButtonAction />, { wrapper: NewPrivateNetworkWrapper });
    expect(screen.getByTestId('create-private-network')).toBeDisabled();
  });

  it('should disabled button when name is empty', async () => {
    await waitFor(() =>
      render(<ButtonAction />, {
        wrapper: ({ children }) => {
          const form = useForm<NewPrivateNetworkForm>({
            defaultValues: {
              region: 'RBX-1',
              isLocalZone: false,
              subnet: {
                cidr,
                enableDhcp: true,
                enableGatewayIp: true,
                ipVersion: 4,
              },
            },
            resolver: zodResolver(NEW_PRIVATE_NETWORK_FORM_SCHEMA),
          });

          return <FormProvider {...form}>{children}</FormProvider>;
        },
      }),
    );

    expect(screen.getByTestId('create-private-network')).toBeDisabled();
  });

  it('should disabled button when cidr is not valid', async () => {
    await waitFor(() =>
      render(<ButtonAction />, {
        wrapper: ({ children }) => {
          const form = useForm<NewPrivateNetworkForm>({
            defaultValues: {
              region: 'RBX-1',
              name: 'test',
              isLocalZone: false,
              subnet: {
                cidr: 'ds10.1.0.0/16',
                enableDhcp: true,
                enableGatewayIp: true,
                ipVersion: 4,
              },
            },
            resolver: zodResolver(NEW_PRIVATE_NETWORK_FORM_SCHEMA),
          });

          return <FormProvider {...form}>{children}</FormProvider>;
        },
      }),
    );

    expect(screen.getByTestId('create-private-network')).toBeDisabled();
  });
});
