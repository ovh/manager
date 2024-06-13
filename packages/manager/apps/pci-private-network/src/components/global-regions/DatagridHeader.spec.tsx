import { describe, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DatagridHeader from '@/components/global-regions/DatagridHeader';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

describe('DatagridHeader', () => {
  it('should render all headers correctly', () => {
    render(<DatagridHeader />);
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
