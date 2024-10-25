import '@testing-library/jest-dom';
import { describe, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import GatewayConfig from './GatewayConfig.component';
import { NEW_PRIVATE_NETWORK_FORM_SCHEMA } from '../../new.constants';
import { NewPrivateNetworkWrapper } from '@/utils/test/test.provider';

vi.mock('@/hooks/useGuideLink/useGuideLink', () => ({
  default: () => ({
    PRIVATE_NETWORK_WITH_GATEWAY: '',
    REGION_AVAILABILITY: '',
  }),
}));
vi.mock('@/hooks/useGatewayAvailabilityRegion/useGatewayAvailabilityRegion');
vi.mock(
  '@/hooks/useAvailableGatewayCatalog/useAvailableGatewayCatalog',
  () => ({
    default: () => ({ catalog: undefined, isLoading: false }),
  }),
);
vi.mock('@/hooks/useExistingGatewayRegion/useExistingGatewayRegion', () => ({
  default: () => ({ gateway: undefined, isLoading: false }),
}));

describe('GatewayConfig default IP', () => {
  it('should not display create gateway checkbox when region is a localZone', () => {
    render(<GatewayConfig />, {
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

    expect(
      screen.queryByText(
        'pci_projects_project_network_private_create_public_gateway',
      ),
    ).not.toBeInTheDocument();
  });

  it('should display create gateway checkbox when region is not a localZone', () => {
    render(<GatewayConfig />, {
      wrapper: NewPrivateNetworkWrapper,
    });

    expect(
      screen.queryByText(
        'pci_projects_project_network_private_create_public_gateway',
      ),
    ).toBeInTheDocument();
  });
});
