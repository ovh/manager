import { waitFor, fireEvent } from '@testing-library/react';
import { describe } from 'vitest';
import {
  assertOdsModalText,
  assertOdsModalVisibility,
} from '@ovh-ux/manager-core-test-utils';
import {
  getButtonByLabel,
  getToggleByName,
  labels,
  renderTest,
} from '@/test-utils';
import { urlDynamicParts, urls } from '@/routes/routes.constant';
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

  it('update firewall state successfully', async () => {
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
    await assertOdsModalVisibility({ container, isVisible: false });
  });
});
