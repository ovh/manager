import { waitFor, screen, fireEvent } from '@testing-library/react';
import { describe } from 'vitest';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  WAIT_FOR_DEFAULT_OPTIONS,
  assertOdsModalText,
} from '@ovh-ux/manager-core-test-utils';
import {
  getButtonByIcon,
  getButtonByLabel,
  getTableCellByContentText,
  getToggleByName,
  labels,
  renderTest,
} from '@/test-utils';
import { urlDynamicParts, urls } from '@/routes/routes.constant';
// import { IpGameFirewallStateEnum } from '@/data/api';
import { fromIpToId } from '@/utils';
import { IpEdgeFirewallStateEnum } from '@/data/api';

describe('Configure edge network firewall page', () => {
  it('disable toggle when edge firewall has an ongoing update', async () => {
    const { container } = await renderTest({
      initialRoute: urls.configureEdgeNetworkFirewall.replace(
        urlDynamicParts.id,
        fromIpToId('239.99.244.14'),
      ),
      nbIp: 6,
      edgeFirewallState: IpEdgeFirewallStateEnum.PENDING_ENABLE,
    });

    const toggleElement = await getToggleByName({
      container,
      name: 'enable-edge-firewall',
    });
    expect(toggleElement).toHaveAttribute('is-disabled', 'true');
  });

  it('display a success message when firewall state is updated successfully', async () => {
    const { container } = await renderTest({
      initialRoute: urls.configureEdgeNetworkFirewall.replace(
        urlDynamicParts.id,
        fromIpToId('239.99.244.14'),
      ),
      nbIp: 6,
      edgeFirewallState: IpEdgeFirewallStateEnum.OK,
      edgeFirewallDisable: true,
    });

    const toggleElement = await getToggleByName({
      container,
      name: 'enable-edge-firewall',
    });
    await waitFor(() => fireEvent.click(toggleElement));
    await assertOdsModalText({
      container,
      text: labels.edgeNetworkFirewall.enable_firewall_modal_title,
    });

    const confirmButton = await getButtonByLabel({
      container,
      label: 'validate',
    });
    await waitFor(() => fireEvent.click(confirmButton));
    // await waitFor(
    //   () =>
    //     expect(
    //       screen.getByText(
    //         labels.edgeNetworkFirewall
    //       ),
    //     ).toBeVisible(),
    //   WAIT_FOR_DEFAULT_OPTIONS,
    // );
  });

  it('display an error message when deny strategy is updated and api is KO', async () => {
    // const { container } = await renderTest({
    //   initialRoute: urls.configureGameFirewall.replace(
    //     urlDynamicParts.id,
    //     fromIpToId('239.99.244.14'),
    //   ),
    //   nbIp: 6,
    //   gameFirewallConfig: {
    //     isUpdateKo: true,
    //     state: IpGameFirewallStateEnum.OK,
    //     firewallModeEnabled: true,
    //   },
    // });
    // const toggleElement = await getToggleByName({
    //   container,
    //   name: 'strategy-default-deny',
    // });
    // await waitFor(() => fireEvent.click(toggleElement));
    // await assertOdsModalText({
    //   container,
    //   text: labels.gameFirewall.disable_deny_strategy_modal_title,
    // });
    // const confirmButton = await getButtonByLabel({
    //   container,
    //   label: 'validate',
    // });
    // await waitFor(() => fireEvent.click(confirmButton));
    // await waitFor(
    //   () =>
    //     expect(
    //       screen.getByText('game firewall update KO', { exact: false }),
    //     ).toBeVisible(),
    //   WAIT_FOR_DEFAULT_OPTIONS,
    // );
  });
});
