import { expect, it, describe } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import {
  organizationList,
  datacentreList,
  EDGE_GATEWAY_MOCKS,
} from '@ovh-ux/manager-module-vcd-api';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { labels, renderTest } from '../../../../../test-utils';
import { urls } from '../../../../../routes/routes.constant';

const config = {
  org: organizationList[0],
  vdc: datacentreList[0],
  edge: EDGE_GATEWAY_MOCKS[0],
  labels: { ...labels.datacentresEdgeGateway, ...labels.actions },
  waitOptions: { timeout: 10_000 },
};
const content = {
  modalElements: [
    config.labels.edge_delete_title,
    config.labels.edge_delete_warning,
    config.labels.edge_delete_description.replace(
      '{{edgeName}}',
      config.edge.currentState.edgeGatewayName,
    ),
  ],
  modalButtons: [
    { testId: 'primary-button', label: config.labels.delete },
    { testId: 'secondary-button', label: config.labels.cancel },
  ],
};

describe('Datacentre Edge Gateway Delete Page', () => {
  const initialRoute = urls.edgeGatewayDelete
    .replace(':id', config.org.id)
    .replace(':vdcId', config.vdc.id)
    .replace(':edgeGatewayId', config.edge.id);

  it('access and display Edge Gateway delete page modal', async () => {
    await renderTest({ initialRoute });

    // wait for data to be loaded
    await waitFor(() => {
      expect(
        screen.getByText(config.edge.currentState.edgeGatewayName),
      ).toBeVisible();
    }, config.waitOptions);

    // check modal
    const modal = screen.getByTestId('modal');
    expect(modal).toBeVisible();
    expect(modal).toHaveAttribute('color', ODS_MODAL_COLOR.critical);

    // check modal content
    await waitFor(() => {
      content.modalElements.forEach((el) =>
        expect(within(modal).getByText(el)).toBeVisible(),
      );
    }, config.waitOptions);

    // check modal buttons
    content.modalButtons.forEach((btn) => {
      const element = within(modal).getByTestId(btn.testId);
      expect(element).toBeVisible();
      expect(element).toBeEnabled();
      expect(element).toHaveAttribute('label', btn.label);
    });
  });
});
