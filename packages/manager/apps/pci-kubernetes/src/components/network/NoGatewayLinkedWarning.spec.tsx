import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NoGatewayLinkedMessage from './NoGatewayLinkedWarning.component';
import { DeploymentMode } from '@/types';
import { TGateway } from '@/api/data/subnets';
import { TNetworkRegion } from '@/api/data/network';

vi.mock('@ovh-ux/manager-react-components', () => ({
  useProjectUrl: () => 'https://project-url',
}));

describe('NoGatewayLinkedMessage', () => {
  it('should show message when no private network exists', () => {
    render(
      <NoGatewayLinkedMessage
        network={[]}
        gateways={[]}
        type={DeploymentMode.MULTI_ZONES}
      />,
    );
    expect(
      screen.getByText('kubernetes_network_form_no_private_network'),
    ).toBeInTheDocument();
    expect(screen.getByText('kubernetes_network_form_add')).toHaveAttribute(
      'href',
      'https://project-url/private-networks',
    );
  });

  it('should show message when gateway is invalid', () => {
    render(
      <NoGatewayLinkedMessage
        network={[{ id: 'net1' } as TNetworkRegion]}
        gateways={[]}
        type={DeploymentMode.MULTI_ZONES}
      />,
    );
    expect(
      screen.getByText('kubernetes_network_form_no_associated_gateway'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('kubernetes_network_form_add_gateway'),
    ).toHaveAttribute('href', 'https://project-url/gateway/new');
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
