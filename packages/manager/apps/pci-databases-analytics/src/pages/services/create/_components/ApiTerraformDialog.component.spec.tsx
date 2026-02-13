import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import * as database from '@/types/cloud/project/database';
import ApiTerraformDialog from '@/pages/services/create/_components/ApiTerraformDialog.component';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedAvailabilities } from '@/__tests__/helpers/mocks/availabilities';
import {
  mockedBasicOrderFunnelFlavor,
  mockedBasicOrderFunnelPlan,
  mockedEngineVersion,
  mockedOrderFunnelEngine,
  mockedOrderFunnelRegion,
} from '@/__tests__/helpers/mocks/order-funnel';
import { NetworkRegionStatusEnum } from '@/types/cloud/network/NetworkRegionStatusEnum';
import { NetworkStatusEnum } from '@/types/cloud/network/NetworkStatusEnum';
import { NetworkTypeEnum } from '@/types/cloud/network/NetworkTypeEnum';
import { useOrderFunnel } from './useOrderFunnel.hook';

const serviceToTerraform = vi.fn().mockName('serviceToTerraform');
const projectId = 'project-123';

describe('ApiTerraformDialog', () => {
  const onRequestClose = vi.fn();

  const dialogDataMock = {
    availability: mockedAvailabilities,
    engine: mockedOrderFunnelEngine,
    version: mockedEngineVersion,
    plan: mockedBasicOrderFunnelPlan,
    region: mockedOrderFunnelRegion,
    flavor: mockedBasicOrderFunnelFlavor,
    nodes: 3,
    additionalStorage: 10,
    name: 'myNewPG',
    ipRestrictions: [
      {
        ip: 'ips',
        description: 'IpDescription',
      },
    ],
    network: {
      type: database.NetworkTypeEnum.public,
      network: {
        id: 'id1',
        name: 'network1',
        regions: [
          {
            region: 'GRA',
            openstackId: 'os-123',
            status: NetworkRegionStatusEnum.ACTIVE,
          },
        ],
        vlanId: 0,
        status: NetworkStatusEnum.ACTIVE,
        type: NetworkTypeEnum.private,
      },
    },
  } as ReturnType<typeof useOrderFunnel>['result'];

  vi.mock('@/hooks/useLocale.hook', () => ({
    useLocale: () => 'fr_FR',
  }));

  vi.mock('@/data/hooks/project/usePciProject.hook', () => ({
    default: () => ({
      data: { project_id: projectId },
    }),
  }));

  vi.mock('@/data/hooks/database/terraform/useServiceToTerraform.hook', () => ({
    useServiceToTerraform: () => ({
      serviceToTerraform,
    }),
  }));

  vi.mock('@datatr-ux/uxlib', async () => {
    const mod = await vi.importActual('@datatr-ux/uxlib');
    return {
      ...mod,
      useToast: () => ({
        toast: vi.fn(),
      }),
    };
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should close the dialog on footer close button click', async () => {
    render(
      <ApiTerraformDialog
        onRequestClose={onRequestClose}
        dialogData={dialogDataMock}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );

    const footerCloseButton = screen.getByTestId('dialog-close-button-footer');
    expect(footerCloseButton).toBeInTheDocument();
    fireEvent.click(footerCloseButton);
    expect(onRequestClose).toHaveBeenCalled();
  });
});
