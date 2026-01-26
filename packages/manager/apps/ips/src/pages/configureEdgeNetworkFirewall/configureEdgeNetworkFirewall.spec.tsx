import { fireEvent, waitFor } from '@testing-library/react';
import { describe } from 'vitest';

import { assertOdsModalText } from '@ovh-ux/manager-core-test-utils';

import { IpEdgeFirewallStateEnum } from '@/data/api';
import { urlDynamicParts, urls } from '@/routes/routes.constant';
import {
  getButtonByLabel,
  getToggleByName,
  labels,
  renderTest,
} from '@/test-utils';
import { fromIpToId } from '@/utils';

describe('Configure edge network firewall page', () => {
  it('disable toggle when edge firewall has an ongoing update', async () => {
    const { container } = await renderTest({
      initialRoute: urls.configureEdgeNetworkFirewall
        .replace(urlDynamicParts.parentId, fromIpToId('239.99.244.14/32'))
        .replace(urlDynamicParts.id, fromIpToId('239.99.244.14')),
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
      initialRoute: urls.configureEdgeNetworkFirewall
        .replace(urlDynamicParts.parentId, fromIpToId('239.99.244.14/32'))
        .replace(urlDynamicParts.id, fromIpToId('239.99.244.14')),
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
    const modal = container.querySelector('ods-modal') as HTMLElement;

    const confirmButton = await getButtonByLabel({
      container: container.querySelector('ods-modal') as HTMLElement,
      label: 'validate',
    });
    await waitFor(() => fireEvent.click(confirmButton));
    await waitFor(() => expect(modal).toHaveAttribute('is-open', 'false'));
  });
});
