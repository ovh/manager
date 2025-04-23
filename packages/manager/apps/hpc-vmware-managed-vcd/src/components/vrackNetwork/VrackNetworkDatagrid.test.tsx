import { ApiResponse } from '@ovh-ux/manager-core-api';
import { vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import {
  mockVrackSegmentList,
  VrackSegment,
} from '@ovh-ux/manager-module-vcd-api';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import fr_FR from '../../../public/translations/datacentres/vrack-network/Messages_fr_FR.json';
import VrackNetworkDatagrid from './VrackNetworkDatagrid.component';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) =>
      fr_FR[translationKey as keyof typeof fr_FR] ?? translationKey,
  }),
}));

vi.mock('@ovh-ux/manager-module-vcd-api', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Record<string, unknown>),
    useVcdVrackNetworkOptions: () => ({
      queryKey: ['vrackNetwork'],
      queryFn: () =>
        Promise.resolve({
          data: mockVrackSegmentList,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        } as ApiResponse<VrackSegment[]>),
    }),
  };
});

const renderVrackNetworkDatagrid = () => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <VrackNetworkDatagrid id="test-id" vdcId="test-vdc-id" />
    </QueryClientProvider>,
  );
};

describe('VrackNetworkDatagrid', () => {
  it('should render the component with title and description', () => {
    renderVrackNetworkDatagrid();

    // Check if title is rendered
    expect(
      screen.getAllByText(fr_FR.managed_vcd_dashboard_vrack_network_title)[0],
    ).toBeInTheDocument();

    // Check if description is rendered
    expect(
      screen.getByText(fr_FR.managed_vcd_dashboard_vrack_network_description),
    ).toBeInTheDocument();
  });

  it('should render the datagrid with correct columns', () => {
    renderVrackNetworkDatagrid();

    // Check if column headers are rendered
    expect(
      screen.getAllByText(fr_FR.managed_vcd_dashboard_vrack_network_title)[0],
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(fr_FR.managed_vcd_dashboard_vrack_network_title)[1],
    ).toBeInTheDocument();

    waitFor(() => {
      // Check if all VLAN IDs are rendered
      mockVrackSegmentList.forEach((network) => {
        expect(screen.getByText(network.targetSpec.vlanId)).toBeInTheDocument();
      });
    });
  });
});
