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
import {
  catalogDedicatedServerList,
  ipMigrationPostResponse,
} from '../../../../../mocks/catalog/dedicated-server-catalog';
import {
  VALID_INPUT_VALUES,
  fillStep1,
  fillStep2,
  fillStep4,
  goToStep,
} from './importIpFromSys.test-utils';

describe('Import IP from Sys modal', () => {
  it('can open the import IP from Sys modal from listing page', async () => {
    const { container } = await renderTest({
      initialRoute: urls.root,
      nbIp: 6,
    });

    const settingsMenuButton = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.cog,
    });

    await waitFor(() => fireEvent.click(settingsMenuButton));

    const importSysMenuButton = await getButtonByLabel({
      container,
      label: labels.listing.listingSettingsImportIpFromSys,
    });

    await waitFor(() => fireEvent.click(importSysMenuButton));
    await assertOdsModalText({
      container,
      text: labels.importIpFromSys.title,
    });

    const cancelButton = await getButtonByLabel({ container, label: 'cancel' });
    await waitFor(() => fireEvent.click(cancelButton));
    await assertOdsModalVisibility({ container, isVisible: false });
  });

  it('lets you go to step 2 if you fill correctly ip and token', async () => {
    const { container } = await renderTest({
      initialRoute: urls.listingImportIpFromSys,
      nbIp: 6,
    });
    await assertOdsModalVisibility({ container, isVisible: true });

    await fillStep1({ ip: 'ip', token: 'token' });

    const nextButton = await getButtonByLabel({
      container,
      label: 'next',
      disabled: true,
    });

    await fillStep1(VALID_INPUT_VALUES);

    await waitFor(
      () => expect(nextButton).toBeEnabled(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    await waitFor(() => fireEvent.click(nextButton));
  });

  it('displays an error if the IP migration is not available for the selected server', async () => {
    const { container } = await renderTest({
      initialRoute: urls.listingImportIpFromSys,
      nbIp: 6,
      isIpMigrationUnavailableInOperations: true,
    });
    await assertOdsModalVisibility({ container, isVisible: true });

    await fillStep1(VALID_INPUT_VALUES);

    await goToStep({ container, stepNumber: 2 });

    await fillStep2();

    await assertOdsModalText({
      container,
      text: labels.importIpFromSys.step2UnavailableMigrationMessage
        .replace('{{ serverName }}', catalogDedicatedServerList[0])
        .replace('{{ ip }}', VALID_INPUT_VALUES.ip),
    });
  });

  it('let you go to step 3 if the IP migration is available for the selected server', async () => {
    const { container } = await renderTest({
      initialRoute: urls.listingImportIpFromSys,
      nbIp: 6,
    });
    await assertOdsModalVisibility({ container, isVisible: true });

    await fillStep1(VALID_INPUT_VALUES);

    await goToStep({ container, stepNumber: 2 });

    await fillStep2();

    await assertOdsModalText({
      container,
      text: labels.importIpFromSys.step2CompatibilitySuccessMessage
        .replace('{{ serverName }}', catalogDedicatedServerList[0])
        .replace('{{ ip }}', VALID_INPUT_VALUES.ip),
    });

    await goToStep({ container, stepNumber: 3 });
  });

  it('displays an error if the IP and the server are not compatible', async () => {
    const { container } = await renderTest({
      initialRoute: urls.listingImportIpFromSys,
      nbIp: 6,
      isDedicatedServerIpMigrationAvailableDurationsKo: true,
    });
    await assertOdsModalVisibility({ container, isVisible: true });

    await fillStep1(VALID_INPUT_VALUES);

    await goToStep({ container, stepNumber: 2 });

    await fillStep2();

    await assertOdsModalText({ container, text: 'Une erreur est survenue' });
  });

  it('let you go to step 3 if the IP migration is available for the selected server', async () => {
    const { container } = await renderTest({
      initialRoute: urls.listingImportIpFromSys,
      nbIp: 6,
    });
    await assertOdsModalVisibility({ container, isVisible: true });

    await fillStep1(VALID_INPUT_VALUES);

    await goToStep({ container, stepNumber: 2 });

    await fillStep2();

    await assertOdsModalText({
      container,
      text: labels.importIpFromSys.step2CompatibilitySuccessMessage
        .replace('{{ serverName }}', catalogDedicatedServerList[0])
        .replace('{{ ip }}', VALID_INPUT_VALUES.ip),
    });

    await goToStep({ container, stepNumber: 3 });
  });

  it('displays a success message if the IP migration order is successful', async () => {
    const { container } = await renderTest({
      initialRoute: urls.listingImportIpFromSys,
      nbIp: 6,
    });
    await assertOdsModalVisibility({ container, isVisible: true });

    await fillStep1(VALID_INPUT_VALUES);

    await goToStep({ container, stepNumber: 2 });

    await fillStep2();

    await assertOdsModalText({
      container,
      text: labels.importIpFromSys.step2CompatibilitySuccessMessage
        .replace('{{ serverName }}', catalogDedicatedServerList[0])
        .replace('{{ ip }}', VALID_INPUT_VALUES.ip),
    });

    await goToStep({ container, stepNumber: 3 });

    await goToStep({ container, stepNumber: 4 });

    await fillStep4(container);

    await goToStep({ container, stepNumber: 5 });

    const confirmButton = await getButtonByLabel({
      container,
      label: 'confirm',
    });
    await waitFor(() => fireEvent.click(confirmButton));

    await assertOdsModalVisibility({ container, isVisible: false });

    await waitFor(
      () =>
        screen.getByText(
          labels.importIpFromSys.step5SuccessMessage.replace(
            '{{ orderId }}',
            ipMigrationPostResponse.orderId.toString(),
          ),
        ),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });
});
