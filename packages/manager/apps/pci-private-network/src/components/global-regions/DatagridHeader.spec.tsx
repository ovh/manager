import { describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import DatagridHeader from '@/components/global-regions/DatagridHeader';

describe('DatagridHeader', () => {
  it('should render all headers correctly', () => {
    render(
      <table>
        <thead>
          <DatagridHeader />
        </thead>
      </table>,
    );
    expect(
      screen.getByText('pci_projects_project_network_private_vlan_id'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('pci_projects_project_network_private_name'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('pci_projects_project_network_private_region'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('pci_projects_project_network_private_gateway'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('pci_projects_project_network_private_ip_allocation'),
    ).toBeInTheDocument();
  });
});
