import { organizationList } from '@ovh-ux/manager-module-vcd-api';
import {
  assertModalText,
  assertTextVisibility,
  assertOdsElementEnabledState,
  assertOdsModalVisibility,
  getElementByTestId,
  assertOdsModalText,
} from '@ovh-ux/manager-core-test-utils';
import {
  renderTest,
  labels,
  mockSubmitNewValue,
  mockEditInputValue,
} from '../../../../test-utils';
import TEST_IDS from '../../../../utils/testIds.constants';

describe('Organization General Information Page', () => {
  it('display the VCD dashboard general page', async () => {
    await renderTest({ initialRoute: `/${organizationList[0].id}` });

    const dashboardElements = [
      labels.dashboard.managed_vcd_dashboard_general_information,
      labels.dashboard.managed_vcd_dashboard_options,
      labels.dashboard.managed_vcd_dashboard_data_protection,
      labels.dashboard.managed_vcd_dashboard_service_management,
    ];

    dashboardElements.forEach(async (element) => assertTextVisibility(element));
  });

  it('display an error', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}`,
      isOrganizationKo: true,
    });

    await assertTextVisibility('Organization error');
  });
});

describe('Organization General Information Page Updates', () => {
  it.skip.each([
    {
      inputName: 'name',
      initialRoute: `/${organizationList[1].id}/edit-name`,
      successMessage:
        labels.dashboard.managed_vcd_dashboard_edit_name_modal_success,
    },
    {
      inputName: 'description',
      initialRoute: `/${organizationList[1].id}/edit-description`,
      successMessage:
        labels.dashboard.managed_vcd_dashboard_edit_description_modal_success,
    },
  ])(
    'update the $inputName of the organization',
    async ({ initialRoute, successMessage }) => {
      const { container } = await renderTest({ initialRoute });

      await assertOdsModalVisibility({ container, isVisible: true });

      const submitCta = await getElementByTestId(TEST_IDS.modalConfirmEditCta);
      await mockSubmitNewValue({ submitCta });

      await assertOdsModalVisibility({ container, isVisible: false });
      await assertTextVisibility(successMessage);
    },
  );

  it.each([
    {
      inputName: 'name',
      initialRoute: `/${organizationList[1].id}/edit-name`,
      error:
        labels.dashboard.managed_vcd_dashboard_edit_name_modal_helper_error,
    },
    {
      inputName: 'description',
      initialRoute: `/${organizationList[1].id}/edit-description`,
      error:
        labels.dashboard
          .managed_vcd_dashboard_edit_description_modal_helper_error,
    },
  ])(
    'display helper message when the input $inputName is invalid',
    async ({ initialRoute, error }) => {
      const { container } = await renderTest({ initialRoute });

      await assertOdsModalVisibility({ container, isVisible: true });
      const submitCta = await getElementByTestId(TEST_IDS.modalConfirmEditCta);

      await mockEditInputValue('');
      await assertOdsModalText({ container, text: error });
      assertOdsElementEnabledState({ element: submitCta, enabled: false });

      await mockEditInputValue('a'.repeat(256));
      await assertOdsModalText({ container, text: error });
      assertOdsElementEnabledState({ element: submitCta, enabled: false });
    },
  );

  it.skip.each([
    {
      inputName: 'name',
      initialRoute: `/${organizationList[1].id}/edit-name`,
    },
    {
      inputName: 'description',
      initialRoute: `/${organizationList[1].id}/edit-description`,
    },
  ])(
    'display an error if trying to update $inputName while updateOrganizationService is KO',
    async ({ initialRoute }) => {
      const { container } = await renderTest({
        initialRoute,
        isOrganizationUpdateKo: true,
      });

      await assertOdsModalVisibility({ container, isVisible: true });

      const submitCta = await getElementByTestId(TEST_IDS.modalConfirmEditCta);
      await mockSubmitNewValue({ submitCta });

      await assertOdsModalVisibility({ container, isVisible: true });
      await assertModalText({ container, text: 'Organization update error' });
    },
  );
});
