import { expect, it, describe } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import {
  organizationList,
  datacentreList,
  EDGE_GATEWAY_MOCKS,
} from '@ovh-ux/manager-module-vcd-api';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { labels, renderTest } from '../../../../test-utils';
import { EDGE_GATEWAY_LABEL } from '../datacentreDashboard.constants';
import { urls } from '../../../../routes/routes.constant';
import TEST_IDS from '../../../../utils/testIds.constants';

const config = {
  org: organizationList[0],
  vdc: datacentreList[0],
  edge: EDGE_GATEWAY_MOCKS[0],
  labels: { ...labels.datacentresEdgeGateway, ...labels.commonDashboard },
  waitOptions: { timeout: 10_000 },
};

describe('Datacentre Edge Gateway Listing Page', () => {
  const initialRoute = urls.edgeGateway
    .replace(':id', config.org.id)
    .replace(':vdcId', config.vdc.id);

  it('access and display Edge Gateway listing page', async () => {
    await renderTest({ initialRoute });

    // check page title
    await assertTextVisibility(EDGE_GATEWAY_LABEL);

    // wait for data to be loaded
    await waitFor(() => {
      expect(
        screen.getByText(config.edge.currentState.edgeGatewayName),
      ).toBeVisible();
    }, config.waitOptions);

    // check order button
    const orderCta = screen.getByTestId(TEST_IDS.edgeGatewayOrderCta);
    expect(orderCta).toBeVisible();
    expect(orderCta).toBeEnabled();
    expect(orderCta).toHaveAttribute('label', config.labels.edge_add);

    // check datagrid columns
    const elements = [
      labels.commonDashboard.name,
      config.labels.edge_ip_block,
      config.labels.edge_connectivity_type,
      config.edge.currentState.edgeGatewayName,
      config.edge.currentState.ipBlock,
    ];
    elements.forEach((el) => expect(screen.getByText(el)).toBeVisible());
  });

  // TODO: [EDGE] remove when unmocking
  it.skip('display an error', async () => {
    await renderTest({ initialRoute, isEdgeGatewayKO: true });

    await assertTextVisibility(labels.error.manager_error_page_default);
  });
});
