import { ApiResponse } from '@ovh-ux/manager-core-api';
import { vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import {
  mockVrackSegmentList,
  VCDVrackSegment,
} from '@ovh-ux/manager-module-vcd-api';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import fr_FR from '../../../public/translations/datacentres/vrack-segment/Messages_fr_FR.json';
import { VrackSegmentDatagrid } from './VrackSegmentDatagrid.component';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string, params: Record<string, string>) => {
      let translatedKey =
        fr_FR[translationKey.split(':')[1] as keyof typeof fr_FR] ??
        translationKey;
      if (params) {
        Object.keys(params).forEach((key) => {
          translatedKey = translatedKey.replace(`{{ ${key} }}`, params[key]);
        });
      }
      return translatedKey;
    },
  }),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Record<string, unknown>),
    useHref: vi.fn(() => '/test-edit-url'),
    useNavigate: () => ({ navigate: vi.fn() }),
  };
});

vi.mock('@ovh-ux/manager-module-vcd-api', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Record<string, unknown>),
    useVcdVrackSegmentListOptions: () => ({
      queryKey: ['vrackSegment'],
      queryFn: () =>
        Promise.resolve({
          data: mockVrackSegmentList,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        } as ApiResponse<VCDVrackSegment[]>),
    }),
  };
});

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Record<string, unknown>),
    useOvhTracking: () => ({
      trackPage: vi.fn(),
      trackClick: vi.fn(),
    }),
  };
});

const renderVrackSegmentDatagrid = () => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <VrackSegmentDatagrid id="test-id" vdcId="test-vdc-id" />
    </QueryClientProvider>,
  );
};

describe('VrackSegmentDatagrid', () => {
  it('should render the component with title and description', () => {
    renderVrackSegmentDatagrid();

    // Check if title is rendered
    waitFor(() =>
      expect(
        screen.getAllByText(fr_FR.managed_vcd_dashboard_vrack_segments)[0],
      ).toBeInTheDocument(),
    );

    // Check if description is rendered
    expect(
      screen.getByText(fr_FR.managed_vcd_dashboard_vrack_description),
    ).toBeInTheDocument();
  });

  it('should render the datagrid with correct columns', () => {
    renderVrackSegmentDatagrid();

    // Check if column headers are rendered
    waitFor(() =>
      expect(
        screen.getAllByText(fr_FR.managed_vcd_dashboard_vrack_segments)[0],
      ).toBeInTheDocument(),
    );
    expect(
      screen.getAllByText(fr_FR.managed_vcd_dashboard_vrack_segment)[0],
    ).toBeInTheDocument();

    waitFor(
      () => {
        expect(
          screen.getAllByText(
            fr_FR.managed_vcd_dashboard_vrack_column_segment_vrack_label.replace(
              '{{ vlanId }}',
              mockVrackSegmentList[0].targetSpec.vlanId,
            ),
          )[0],
        ).toBeInTheDocument();
        // Check if all VLAN IDs are rendered
        mockVrackSegmentList.forEach((network) => {
          expect(
            screen.getByText(network.targetSpec.vlanId),
          ).toBeInTheDocument();
        });
      },
      { timeout: 4_000 },
    );
  });
});
