import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  assertElementLabel,
  assertTextVisibility,
  getElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import { VCDDatacentre, VCDOrganization } from '@ovh-ux/manager-module-vcd-api';

import { FEATURE_FLAGS } from '@/app.constants';

import { ID_LABEL } from '../../../pages/dashboard/dashboard.constants';
import {
  VRACK_ONBOARDING_PATH,
  VRACK_PATH,
} from '../../../pages/listing/datacentres/Datacentres.constants';
import { TRACKING } from '../../../tracking.constants';
import TEST_IDS from '../../../utils/testIds.constants';
import DatacentreGeneralInformationTile from './DatacentreGeneralInformationTile.component';

const trackClickMock = vi.fn();
let mockedUrl = '';
vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({ trackClick: trackClickMock }),
    useNavigationGetUrl: vi.fn(([basePath, pathWithId]) => {
      mockedUrl = `${basePath}${pathWithId}`;
      return {
        data: mockedUrl,
      };
    }),
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => vi.fn(),
    useParams: () => ({ id: 'id' }),
    Route: module.Route,
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

const vcdOrg = {
  currentState: {
    apiUrl: 'https://vcd.my.demo.lab',
    description: 'My demo VCD Organization',
    fullName: 'Demo VCD',
    region: 'CA-EAST-BHS',
    name: 'org-ca-east-bhs-61ebdcec-0623-4a61-834f-a1719cd475b4',
    spla: true,
    webInterfaceUrl: 'https://vcd.my.second.lab',
  },
  id: '61ebdcec-0623-4a61-834f-a1719cd475b4',
  resourceStatus: 'READY',
  targetSpec: {
    description: 'My demo VCD Organization',
    fullName: 'Demo VCD',
  },
  iam: {
    id: 'iam:id',
    urn: 'test:urn',
  },
};

const datacentre = {
  currentState: {
    commercialRange: 'NSX',
    ipQuota: 4,
    storageQuota: 128,
    vCPUCount: 8,
    region: 'EU-WEST-GRA',
    description: 'organization Virtual DataCenter',
    memoryQuota: 16,
    name: 'vdc-eu-west-gra-f88f2da8-b12a-4796-8765-1e2afb323ad2',
    vCPUSpeed: 60,
  },
  id: 'f88f2da8-b12a-4796-8765-1e2afb323ad2',
  resourceStatus: 'UPDATING',
  targetSpec: {
    description: 'Primary organization Virtual DataCenter',
    vCPUSpeed: 60,
  },
  iam: {
    id: 'iam:id',
    urn: 'test2:urn',
  },
};

describe('DatacentreGeneralInformationTile component unit test suite', () => {
  it('should define tileTitle and sections', async () => {
    const user = userEvent.setup();
    // when
    render(
      <QueryClientProvider client={queryClient}>
        <DatacentreGeneralInformationTile
          vcdOrganization={vcdOrg as VCDOrganization}
          vcdDatacentre={datacentre as VCDDatacentre}
        />
      </QueryClientProvider>,
    );

    // then
    const texts = [
      'managed_vcd_vdc_commercial_range',
      'managed_vcd_vdc_vcpu_count',
      'managed_vcd_vdc_ram_count',
      'managed_vcd_vdc_vcpu_speed',
      'managed_vcd_dashboard_management_interface',
      'managed_vcd_dashboard_api_url',
      ID_LABEL,
      datacentre.currentState.description,
      datacentre.currentState.vCPUCount.toString(),
    ];

    await Promise.all(texts.map((text) => assertTextVisibility(text)));

    // and
    const webUrlLink = await getElementByTestId(TEST_IDS.dashboardDatacentreInterfaceLink);
    await assertElementLabel({
      element: webUrlLink,
      label: 'managed_vcd_dashboard_management_interface_access',
    });
    expect(webUrlLink).toHaveAttribute('href', vcdOrg.currentState.webInterfaceUrl);

    await act(() => user.click(webUrlLink));
    expect(trackClickMock).toHaveBeenCalledWith(TRACKING.datacentreDashboard.goToVcdPortal);
  });

  it('should not be able to update description when datacenter is suspended', () => {
    // when
    render(
      <QueryClientProvider client={queryClient}>
        <DatacentreGeneralInformationTile
          vcdOrganization={vcdOrg as VCDOrganization}
          vcdDatacentre={{ ...datacentre, resourceStatus: 'SUSPENDED' } as VCDDatacentre}
        />
      </QueryClientProvider>,
    );

    // then
    expect(screen.getByTestId(TEST_IDS.editButton).getAttribute('is-disabled')).toBe('true');
  });
});

describe('DatacentreGeneralInformationTile component vrack-related unit test suite', () => {
  it.each([
    {
      scenario: 'without vRack',
      datacentre,
      expectedUrlPath: `/${VRACK_PATH}/${VRACK_ONBOARDING_PATH}`,
      shouldDisplayVrackId: false,
    },
    {
      scenario: 'with vRack',
      datacentre: {
        ...datacentre,
        currentState: {
          ...datacentre.currentState,
          vrack: 'pn-12345',
        },
      },
      expectedUrlPath: `/${VRACK_PATH}/pn-12345`,
      shouldDisplayVrackId: true,
    },
  ])(
    'should define tileTitle and sections $scenario',
    async ({ datacentre: dc, expectedUrlPath, shouldDisplayVrackId }) => {
      vi.mock('@ovh-ux/manager-module-common-api', () => ({
        useFeatureAvailability: () => ({
          data: {
            [FEATURE_FLAGS.VRACK]: true,
            [FEATURE_FLAGS.VRACK_ASSOCIATION]: true,
          },
        }),
      }));

      mockedUrl = '';
      trackClickMock.mockClear();
      render(
        <QueryClientProvider client={queryClient}>
          <DatacentreGeneralInformationTile
            vcdOrganization={vcdOrg as VCDOrganization}
            vcdDatacentre={dc as VCDDatacentre}
          />
        </QueryClientProvider>,
      );

      if (shouldDisplayVrackId && 'vrack' in dc.currentState && dc.currentState.vrack) {
        const link = await screen.findByTestId(TEST_IDS.dashboardDatacentreVrackLink);
        expect(link).toHaveAttribute('label', dc.currentState.vrack);
      }

      expect(mockedUrl).toContain(expectedUrlPath);
    },
  );
});
