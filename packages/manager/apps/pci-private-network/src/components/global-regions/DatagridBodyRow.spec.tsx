import { describe, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useHref } from 'react-router-dom';
import DataGridBodyRow from '@/components/global-regions/DatagridBodyRow';
import { TAggregatedNetwork } from '@/api/data/network';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('react-router-dom', () => ({
  useHref: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useOvhTracking: () => ({ trackClick: vi.fn() }),
  };
});

describe('DataGridBodyRow', () => {
  it('should render vlanId and name for the first subnet', () => {
    const network = ({
      vlanId: 'mocked_vlanId',
      name: 'mocked_name',
      subnets: [{ region: 'mocked_region', cidr: 'mocked_cidr' }],
    } as unknown) as TAggregatedNetwork;

    render(
      <DataGridBodyRow network={network} projectUrl="mocked_projectUrl" />,
    );
    expect(screen.getByText('mocked_vlanId')).toBeInTheDocument();
    expect(screen.getByText('mocked_name')).toBeInTheDocument();
  });

  it('should not render vlanId and name for the second subnet', () => {
    const network = ({
      vlanId: 'mocked_vlanId',
      name: 'mocked_name',
      subnets: [
        { region: 'mocked_region', cidr: 'mocked_cidr' },
        { region: 'mocked_region2', cidr: 'mocked_cidr2' },
      ],
    } as unknown) as TAggregatedNetwork;

    render(
      <DataGridBodyRow network={network} projectUrl="mocked_projectUrl" />,
    );
    expect(screen.getAllByText('mocked_region')).toHaveLength(1);
    expect(screen.getAllByText('mocked_cidr')).toHaveLength(1);
    expect(screen.getByText('mocked_vlanId')).toBeInTheDocument();
    expect(screen.getByText('mocked_name')).toBeInTheDocument();
  });

  it('should render delete button with correct href', () => {
    vi.mocked(useHref).mockReturnValue('mocked_href');
    const network = ({
      vlanId: 'mocked_vlanId',
      name: 'mocked_name',
      subnets: [
        {
          region: 'mocked_region',
          cidr: 'mocked_cidr',
          networkId: 'mocked_networkId',
        },
      ],
    } as unknown) as TAggregatedNetwork;

    const { getByTestId } = render(
      <DataGridBodyRow network={network} projectUrl="mocked_projectUrl" />,
    );
    const deleteButton = getByTestId('dataGridBodyRow-delete_button');
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveAttribute('href', 'mocked_href');
  });

  it('should render tooltip with correct text', () => {
    const network = ({
      vlanId: 'mocked_vlanId',
      name: 'mocked_name',
      subnets: [
        {
          region: 'mocked_region',
          cidr: 'mocked_cidr',
          networkId: 'mocked_networkId',
        },
      ],
    } as unknown) as TAggregatedNetwork;

    render(
      <DataGridBodyRow network={network} projectUrl="mocked_projectUrl" />,
    );
    const tooltip = screen.getByText(
      'pci_projects_project_network_private_delete',
    );
    expect(tooltip).toBeInTheDocument();
  });
});
