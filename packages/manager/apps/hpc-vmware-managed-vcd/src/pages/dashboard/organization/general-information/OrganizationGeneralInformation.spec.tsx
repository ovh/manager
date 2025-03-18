import { organizationList } from '@ovh-ux/manager-module-vcd-api';
import {
  assertOdsModalVisibility,
  getElementByTestId,
  assertOdsModalText,
  assertTextVisibility,
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
});

describe('Organization General Information Page Updates', () => {
  const editNameRoute = `/${organizationList[1].id}/edit-name`;
  const editDescriptionRoute = `/${organizationList[1].id}/edit-description`;

  it.each([
    {
      inputName: 'name',
      initialRoute: editNameRoute,
      successMessage:
        labels.dashboard.managed_vcd_dashboard_edit_name_modal_success,
    },
    {
      inputName: 'description',
      initialRoute: editDescriptionRoute,
      successMessage:
        labels.dashboard.managed_vcd_dashboard_edit_description_modal_success,
    },
  ])('update the $inputName of the organization', async ({ initialRoute }) => {
    const { container } = await renderTest({ initialRoute });

    await assertOdsModalVisibility({ container, isVisible: true });
  });

  it.each([
    {
      inputName: 'name',
      initialRoute: editNameRoute,
      error:
        labels.dashboard.managed_vcd_dashboard_edit_name_modal_helper_error,
    },
    {
      inputName: 'description',
      initialRoute: editDescriptionRoute,
      error:
        labels.dashboard
          .managed_vcd_dashboard_edit_description_modal_helper_error,
    },
  ])(
    'display helper message when the input $inputName is invalid',
    async ({ initialRoute, error }) => {
      const { container } = await renderTest({ initialRoute });

      await assertOdsModalVisibility({ container, isVisible: true });
      const submitCta = await getElementByTestId(TEST_IDS.modalSubmitCta);

      await mockEditInputValue('');
      await assertOdsModalText({ container, text: error });
      expect(submitCta).toBeDisabled();

      await mockEditInputValue('a'.repeat(256));
      await assertOdsModalText({ container, text: error });
      expect(submitCta).toBeDisabled();
    },
  );

  it.each([
    { inputName: 'name', initialRoute: editNameRoute },
    { inputName: 'description', initialRoute: editDescriptionRoute },
  ])(
    'keeps modal open if trying to update $inputName while updateOrganizationService is KO',
    async ({ initialRoute }) => {
      const { container } = await renderTest({
        initialRoute,
        isOrganizationUpdateKo: true,
      });

      await assertOdsModalVisibility({ container, isVisible: true });

      const submitCta = await getElementByTestId(TEST_IDS.modalSubmitCta);
      await mockSubmitNewValue({ submitCta });

      await assertOdsModalVisibility({ container, isVisible: true });
    },
  );
});
