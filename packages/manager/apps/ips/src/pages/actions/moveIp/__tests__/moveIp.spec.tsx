import { waitFor, screen, fireEvent } from '@testing-library/react';
import { describe } from 'vitest';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  WAIT_FOR_DEFAULT_OPTIONS,
  assertOdsModalText,
  assertOdsModalVisibility,
} from '@ovh-ux/manager-core-test-utils';
import {
  getButtonByIcon,
  getButtonByLabel,
  labels,
  renderTest,
} from '@/test-utils';
import { urls } from '@/routes/routes.constant';
import ipList from '../../../../../mocks/ip/get-ips.json';
import moveIpResponse from '../../../../../mocks/ip/get-ip-move.json';
import { fillStep1, openMoveIpModal } from './moveIp.test-utils';

describe('Move IP modal', () => {
  it('can open the move IP modal from listing page', async () => {
    const { container } = await renderTest({
      initialRoute: urls.root,
      nbIp: 6,
    });

    const menuButton = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.ellipsisVertical,
    });

    await waitFor(() => fireEvent.click(menuButton));

    const moveIpButton = await getButtonByLabel({
      container,
      label: 'move Additional IP',
    });

    await waitFor(() => fireEvent.click(moveIpButton));
    await assertOdsModalText({
      container,
      text: labels.moveIp.step1CurrentServiceLabel,
    });

    const cancelButton = await getButtonByLabel({ container, label: 'cancel' });
    await waitFor(() => fireEvent.click(cancelButton));
    await assertOdsModalVisibility({ container, isVisible: false });
  });

  it('displays an error if the IP has an ongoing move operation', async () => {
    await openMoveIpModal({ hasIpTask: true });

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.moveIp.moveIpOnGoingTaskMessage),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });

  it('lets you go to step 2 if you fill correctly destination service and next hop', async () => {
    const { container } = await openMoveIpModal();

    const { service, nexthop } = moveIpResponse.cloudProject[0];
    await fillStep1({
      container,
      destinationService: service,
      nextHop: nexthop[0],
    });

    const nextButton = await getButtonByLabel({
      container,
      label: 'next',
      disabled: false,
    });
    await waitFor(() => fireEvent.click(nextButton));

    const confirmText = labels.moveIp.step2DescriptionWithNextHop.replace(
      /<b>.*/,
      '',
    );
    const confirmNode = await screen.getByText(confirmText, { exact: false });
    expect(confirmNode.parentElement.innerHTML).toMatchSnapshot();
  });

  it('displays a success message if the IP migration order is successful', async () => {
    const { container } = await openMoveIpModal();

    const { service } = moveIpResponse.dedicatedServer[0];
    await fillStep1({
      container,
      destinationService: service,
    });

    const nextButton = await getButtonByLabel({
      container,
      label: 'next',
      disabled: false,
    });
    await waitFor(() => fireEvent.click(nextButton));

    const confirmText = labels.moveIp.step2DescriptionWithoutNextHop.replace(
      /<b>.*/,
      '',
    );
    const confirmNode = await screen.getByText(confirmText, { exact: false });
    expect(confirmNode.parentElement.innerHTML).toMatchSnapshot();

    const confirmButton = await getButtonByLabel({
      container,
      label: 'confirm',
    });
    await waitFor(() => fireEvent.click(confirmButton));

    await assertOdsModalVisibility({ container, isVisible: false });

    await waitFor(
      () =>
        screen.getByText(
          labels.moveIp.moveIpSuccessMessage
            .replace('{{ip}}', ipList[0])
            .replace('{{destinationService}}', service),
        ),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });
});
