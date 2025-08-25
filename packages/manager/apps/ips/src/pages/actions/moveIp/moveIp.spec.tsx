import { waitFor, screen, fireEvent } from '@testing-library/react';
import { vi, describe } from 'vitest';
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

  it('lets you go to step 2 if you fill correctly destination service and next hop', async () => {
    const { container } = await renderTest({
      // TODO: Replace with a good ip
      initialRoute: urls.listingMoveIp.replace(':id', '1'),
      nbIp: 6,
    });
    await assertOdsModalVisibility({ container, isVisible: true });
  });

  it('displays an error if the IP has an ongoing move operation', async () => {});

  it('displays a success message if the IP migration order is successful', async () => {
    const { container } = await renderTest({
      initialRoute: urls.listingImportIpFromSys,
      nbIp: 6,
    });
    window.open = vi.fn();
    await assertOdsModalVisibility({ container, isVisible: true });

    // TODO: Fill step 1

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
            .replace('{{ip}}', '')
            .replace('{{destinationService}}', ''),
        ),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });
});
