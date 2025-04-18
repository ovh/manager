import '@testing-library/jest-dom';
import { organizationList } from '@ovh-ux/manager-module-vcd-api';
import {
  getElementByTestId,
  assertTextVisibility,
  assertAsyncTextVisibility,
  getAsyncElementByTestId,
  assertElementVisibility,
  assertTextWithinElement,
  assertIsDisabled,
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
      labels.dashboard.managed_vcd_dashboard_options,
      labels.dashboard.managed_vcd_dashboard_data_protection,
      labels.dashboard.managed_vcd_dashboard_service_management,
      labels.dashboard.managed_vcd_dashboard_datacentres_title,
    ];

    // TESTING : check asynchronously for the first element, then check synchronously
    await assertAsyncTextVisibility(dashboardElements[0]);
    dashboardElements.slice(1).forEach(assertTextVisibility);
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
    await renderTest({ initialRoute });

    const modal = await getAsyncElementByTestId(TEST_IDS.modalEdit);
    assertElementVisibility(modal);
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
      await renderTest({ initialRoute });

      const modal = await getAsyncElementByTestId(TEST_IDS.modalEdit);
      assertElementVisibility(modal);
      const submitCta = getElementByTestId(TEST_IDS.modalSubmitCta);

      await mockEditInputValue('');
      assertTextWithinElement({ element: modal, text: error });
      assertIsDisabled(submitCta);

      await mockEditInputValue('a'.repeat(256));
      assertTextWithinElement({ element: modal, text: error });
      assertIsDisabled(submitCta);
    },
  );

  it.each([
    { inputName: 'name', initialRoute: editNameRoute },
    { inputName: 'description', initialRoute: editDescriptionRoute },
  ])(
    'keeps modal open if trying to update $inputName while updateOrganizationService is KO',
    async ({ initialRoute }) => {
      await renderTest({ initialRoute, isOrganizationUpdateKo: true });

      const modal = await getAsyncElementByTestId(TEST_IDS.modalEdit);
      assertElementVisibility(modal);

      const submitCta = getElementByTestId(TEST_IDS.modalSubmitCta);
      await mockSubmitNewValue({ submitCta });

      assertElementVisibility(modal);
    },
  );
});
