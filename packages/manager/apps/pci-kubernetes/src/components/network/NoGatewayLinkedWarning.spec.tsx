import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NoGatewayLinkedMessage from './NoGatewayLinkedWarning.component';
import { DeploymentMode } from '@/types';
import { TGateway } from '@/api/data/subnets';
import { TNetworkRegion } from '@/api/data/network';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        kubernetes_network_form_no_private_network:
          'No private network available.',
        kubernetes_network_form_no_associated_gateway: 'No associated gateway.',
        kubernetes_network_form_add: 'Add one',
      };
      return translations[key] ?? key;
    },
  }),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  useProjectUrl: () => 'https://project-url',
}));

vi.mock('@/pages/new/steps/NetworkClusterStep.component', () => ({
  isValidGateway3AZ: (type: DeploymentMode, gateways: TGateway[]) =>
    type === DeploymentMode.MULTI_ZONES &&
    gateways.length > 0 &&
    gateways[0].id === 'valid',
}));

describe('NoGatewayLinkedMessage', () => {
  it('should show message when no private network exists', () => {
    render(
      <NoGatewayLinkedMessage
        network={[]}
        gateways={[{ id: 'valid' } as TGateway]}
        type={DeploymentMode.MULTI_ZONES}
      />,
    );
    expect(
      screen.getByText('No private network available.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Add one')).toHaveAttribute(
      'href',
      'https://project-url/private-networks',
    );
  });

  it('should show message when gateway is invalid', () => {
    render(
      <NoGatewayLinkedMessage
        network={[{ id: 'net1' } as TNetworkRegion]}
        gateways={[{ id: 'invalid' } as TGateway]}
        type={DeploymentMode.MULTI_ZONES}
      />,
    );
    expect(screen.getByText('No associated gateway.')).toBeInTheDocument();
    expect(screen.getByText('Add one')).toHaveAttribute(
      'href',
      'https://project-url/gateway/new',
    );
  });

  it('should render nothing when network and gateway are valid', () => {
    const { container } = render(
      <NoGatewayLinkedMessage
        network={[{ id: 'net1' } as TNetworkRegion]}
        gateways={[{ id: 'valid' } as TGateway]}
        type={DeploymentMode.MULTI_ZONES}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
