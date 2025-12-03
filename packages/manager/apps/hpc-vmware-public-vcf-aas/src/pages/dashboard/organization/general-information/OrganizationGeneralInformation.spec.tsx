import { act, waitFor } from '@testing-library/react';

import {
  assertOdsModalText,
  assertOdsModalVisibility,
  assertTextVisibility,
  getElementByTestId,
} from '@ovh-ux/manager-core-test-utils';

import { SAFE_MOCK_DATA } from '@/test-utils/safeMockData.utils';

import { labels, mockEditInputValue, renderTest } from '../../../../test-utils';
import TEST_IDS from '../../../../utils/testIds.constants';

const config = {
  org: SAFE_MOCK_DATA.orgStandard,
};

describe('Organization General Information Page', () => {
  it('display the VCD dashboard general page', async () => {
    await renderTest({ initialRoute: `/${config.org.id}` });

    const texts = [
      labels.dashboard.managed_vcd_dashboard_options,
      labels.dashboard.managed_vcd_dashboard_data_protection,
      labels.dashboard.managed_vcd_dashboard_service_management,
    ];

    await Promise.all(texts.map((text) => assertTextVisibility(text)));
  });
});

describe('Organization General Information Page Updates', () => {
  const editNameRoute = `/${config.org.id}/edit-name`;
  const editDescriptionRoute = `/${config.org.id}/edit-description`;

  it.each([
    {
      inputName: 'name',
      initialRoute: editNameRoute,
      successMessage: labels.dashboard.managed_vcd_dashboard_edit_name_modal_success,
      value: `New VCD Name`,
    },
    {
      inputName: 'description',
      initialRoute: editDescriptionRoute,
      successMessage: labels.dashboard.managed_vcd_dashboard_edit_description_modal_success,
      value: 'New VCD Description',
    },
  ])(
    'successfully updates $inputName: closes modal and shows success banner',
    async ({ initialRoute, successMessage, value }) => {
      const { container } = await renderTest({ initialRoute });
      await assertOdsModalVisibility({ container, isVisible: true });
      const submitCta = await getElementByTestId(TEST_IDS.modalSubmitCta);
      await waitFor(() => expect(submitCta).toBeDisabled());
      await mockEditInputValue(value);
      await waitFor(() => expect(submitCta).toBeEnabled());
      act(() => {
        submitCta.click();
      });
      await assertOdsModalVisibility({ container, isVisible: false });
      await assertTextVisibility(successMessage);
    },
  );

  it.each([
    {
      inputName: 'name',
      initialRoute: editNameRoute,
      error: labels.dashboard.managed_vcd_dashboard_edit_name_modal_helper_error,
    },
    {
      inputName: 'description',
      initialRoute: editDescriptionRoute,
      error: labels.dashboard.managed_vcd_dashboard_edit_description_modal_helper_error,
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
    { inputName: 'name', initialRoute: editNameRoute, value: 'valid name' },
    {
      inputName: 'description',
      initialRoute: editDescriptionRoute,
      value: 'valid description',
    },
  ])(
    'keeps modal open if trying to update $inputName while updateOrganizationService is KO',
    async ({ initialRoute, value }) => {
      const { container } = await renderTest({
        initialRoute,
        isOrganizationUpdateKo: true,
      });

      await assertOdsModalVisibility({ container, isVisible: true });

      const submitCta = await getElementByTestId(TEST_IDS.modalSubmitCta);
      await mockEditInputValue(value);
      await waitFor(() => expect(submitCta).toBeEnabled());
      act(() => {
        submitCta.click();
      });
      await assertOdsModalVisibility({ container, isVisible: true });

      await assertOdsModalText({
        container,
        text: labels.commun.error.error_message.replace('{{message}}', 'Organization update error'),
      });
    },
  );
});
