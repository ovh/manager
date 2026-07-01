import { expect, it, describe } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import {
  organizationList,
  datacentreList,
  datacentreNsxMock,
  EDGE_GATEWAY_MOCKS,
  IP_BLOCK_MOCKS,
} from '@ovh-ux/manager-module-vcd-api';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { labels, renderTest } from '../../../../test-utils';
import { EDGE_GATEWAY_LABEL } from '../datacentreDashboard.constants';
import { urls } from '../../../../routes/routes.constant';
import TEST_IDS from '../../../../utils/testIds.constants';
import { getEdgeGatewayAssignedIpBlock } from '../../../../utils/aggregateEdgeGateways';
import { FEATURE_FLAGS } from '../../../../app.constants';

const config = {
  org: organizationList[0],
  vdcStandard: datacentreList[0],
  vdcNsx: datacentreNsxMock,
  edge: EDGE_GATEWAY_MOCKS[0],
  labels: { ...labels.datacentresEdgeGateway, ...labels.commonDashboard },
  waitOptions: { timeout: 10_000 },
};

describe('Datacentre Edge Gateway Listing Page', () => {
  const initialRoute = urls.edgeGateway
    .replace(':id', config.org.id)
    .replace(':vdcId', config.vdcNsx.id);

  it('display Edge Gateway listing page when: FF true, VDC NSX-compatible', async () => {
    await renderTest({
      initialRoute,
      feature: { [FEATURE_FLAGS.EDGE_GATEWAY]: true },
    });

    // check page title
    await assertTextVisibility(EDGE_GATEWAY_LABEL, undefined, {
      timeout: 10_000,
    });

    // wait for data to be loaded
    await waitFor(() => {
      expect(screen.getByText(config.edge.currentState.name)).toBeVisible();
    }, config.waitOptions);

    // check order button
    const orderCta = screen.getByTestId(TEST_IDS.edgeGatewayOrderCta);
    expect(orderCta).toBeVisible();
    expect(orderCta).toBeEnabled();
    expect(orderCta).toHaveAttribute('label', config.labels.edge_add);

    const edgeIpBlock = getEdgeGatewayAssignedIpBlock(
      config.edge,
      IP_BLOCK_MOCKS,
    );

    // check datagrid columns
    const elements = [
      labels.commonDashboard.name,
      config.labels.edge_ip_block,
      config.edge.currentState.name,
      edgeIpBlock?.currentState.internalScope || '',
    ];
    elements
      .filter((el) => !!el)
      .forEach((el) => expect(screen.getByText(el)).toBeVisible());
  });

  it('display an error', async () => {
    await renderTest({ initialRoute, isEdgeGatewayKO: true });

    await assertTextVisibility(labels.error.manager_error_page_default);
  });

  it.each([
    {
      desc: 'FF true, VDC not NSX-compatible',
      isFeatureAvailable: true,
      initialRoute: urls.edgeGateway
        .replace(':id', config.org.id)
        .replace(':vdcId', config.vdcStandard.id),
    },
    {
      desc: 'FF false, VDC NSX-compatible',
      isFeatureAvailable: false,
      initialRoute: urls.edgeGateway
        .replace(':id', config.org.id)
        .replace(':vdcId', config.vdcNsx.id),
    },
  ])(
    'block access to Edge Gateway listing when $desc',
    async ({ initialRoute, isFeatureAvailable }) => {
      await renderTest({
        initialRoute,
        feature: { [FEATURE_FLAGS.EDGE_GATEWAY]: isFeatureAvailable },
      });

      // check page title
      await waitFor(() => {
        expect(screen.queryByText(EDGE_GATEWAY_LABEL)).not.toBeInTheDocument();
      }, config.waitOptions);
    },
  );
});
