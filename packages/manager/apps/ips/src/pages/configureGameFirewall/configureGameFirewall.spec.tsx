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
import { IpGameFirewallStateEnum } from '@/data/api';
import { fromIpToId } from '@/utils';

describe('Configure game firewall page', () => {
  it('can navigate from listing page to game firewall page if there is an attached service', async () => {
    const { container } = await renderTest({
      initialRoute: urls.root,
      nbIp: 6,
      gameFirewallConfig: {
        isUpdateKo: true,
        state: IpGameFirewallStateEnum.OK,
        firewallModeEnabled: true,
      },
    });

    const cell = await getTableCellByContentText({
      container,
      text: 'ns123456.ip-239-99-244.net',
    });

    const row = cell.parentElement;

    const menuButton = await getButtonByIcon({
      container: row,
      iconName: ODS_ICON_NAME.ellipsisVertical,
    });

    await waitFor(() => fireEvent.click(menuButton));

    const configureGameFirewallButton = await getButtonByLabel({
      container,
      label: labels.listing.listingActionManageGameMitigation,
    });

    await waitFor(() => fireEvent.click(configureGameFirewallButton));

    await waitFor(
      () => expect(screen.getByText(labels.gameFirewall.title)).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });

  it('disable toggle when game firewall has an ongoing update', async () => {
    const { container } = await renderTest({
      initialRoute: urls.configureGameFirewall.replace(
        urlDynamicParts.id,
        fromIpToId('239.99.244.14'),
      ),
      nbIp: 6,
      gameFirewallConfig: {
        state: IpGameFirewallStateEnum.PENDING_DISABLE,
        firewallModeEnabled: true,
      },
    });

    const toggleElement = await getToggleByName({
      container,
      name: 'strategy-default-deny',
    });
    expect(toggleElement).toHaveAttribute('disabled', '');
  });

  it('display a success message when deny strategy is updated successfully', async () => {
    const { container } = await renderTest({
      initialRoute: urls.configureGameFirewall.replace(
        urlDynamicParts.id,
        fromIpToId('239.99.244.14'),
      ),
      nbIp: 6,
      gameFirewallConfig: {
        state: IpGameFirewallStateEnum.OK,
        firewallModeEnabled: false,
      },
    });

    const toggleElement = await getToggleByName({
      container,
      name: 'strategy-default-deny',
    });

    await waitFor(() => fireEvent.click(toggleElement));

    await assertOdsModalText({
      container,
      text: labels.gameFirewall.enable_deny_strategy_modal_title,
    });

    const confirmButton = await getButtonByLabel({
      container,
      label: 'validate',
    });

    await waitFor(() => fireEvent.click(confirmButton));

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.gameFirewall.default_deny_strategy_enabled_success_message,
          ),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });

  it('display an error message when deny strategy is updated and api is KO', async () => {
    const { container } = await renderTest({
      initialRoute: urls.configureGameFirewall.replace(
        urlDynamicParts.id,
        fromIpToId('239.99.244.14'),
      ),
      nbIp: 6,
      gameFirewallConfig: {
        isUpdateKo: true,
        state: IpGameFirewallStateEnum.OK,
        firewallModeEnabled: true,
      },
    });

    const toggleElement = await getToggleByName({
      container,
      name: 'strategy-default-deny',
    });

    await waitFor(() => fireEvent.click(toggleElement));

    await assertOdsModalText({
      container,
      text: labels.gameFirewall.disable_deny_strategy_modal_title,
    });

    const confirmButton = await getButtonByLabel({
      container,
      label: 'validate',
    });

    await waitFor(() => fireEvent.click(confirmButton));

    await waitFor(
      () =>
        expect(
          screen.getByText('game firewall update KO', { exact: false }),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });
});
