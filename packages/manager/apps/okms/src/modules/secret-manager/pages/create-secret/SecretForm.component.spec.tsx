import { useSearchParams } from 'react-router-dom';

import { SECRET_FORM_FIELD_TEST_IDS } from '@secret-manager/components/form/form.constants';
import { SECRET_FORM_TEST_IDS } from '@secret-manager/pages/create-secret/SecretForm.constants';
import {
  MOCK_DATA_VALID_JSON,
  MOCK_PATH_VALID,
} from '@secret-manager/utils/tests/secret.constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { vi } from 'vitest';

import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';

import { initTestI18n, labels } from '@/common/utils/tests/init.i18n';
import {
  changeOdsInputValueByTestId,
  clickJsonEditorToggle,
} from '@/common/utils/tests/uiTestHelpers';

import { SecretForm } from './SecretForm.component';

let i18nValue: i18n;

vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => vi.fn(),
    useHref: vi.fn((link: string) => link),
    useSearchParams: vi.fn(),
  };
});

// Mocking ODS Input component
vi.mock('@ovhcloud/ods-components/react', async () => {
  const { odsInputMock, odsTextareaMock, odsSwitchMock, odsSwitchItemMock } = await import(
    '@/common/utils/tests/odsMocks'
  );
  const original = await vi.importActual('@ovhcloud/ods-components/react');
  return {
    ...original,
    OdsInput: vi.fn(odsInputMock),
    OdsTextarea: vi.fn(odsTextareaMock),
    OdsSwitch: vi.fn(odsSwitchMock),
    OdsSwitchItem: vi.fn(odsSwitchItemMock),
  };
});

vi.mock('@/common/hooks/useOkmsTracking', () => ({
  useOkmsTracking: () => ({ trackClick: vi.fn() }),
}));

vi.mocked(useSearchParams).mockReturnValue([new URLSearchParams(), vi.fn()]);

/**
 * Renders the secret form
 */
const renderSecretForm = async (okmsId?: string) => {
  const queryClient = new QueryClient();
  if (!i18nValue) {
    i18nValue = await initTestI18n();
  }

  return render(
    <I18nextProvider i18n={i18nValue}>
      <QueryClientProvider client={queryClient}>
        <SecretForm okmsId={okmsId} />
      </QueryClientProvider>
    </I18nextProvider>,
  );
};

const MOCK_OKMS_ID = 'a1c3e7f8-5fc5-4c4e-8eac-60076ac25c00';

describe('Secrets creation form test suite', () => {
  it.each([
    { shouldButtonBeDisabled: true },
    {
      data: MOCK_DATA_VALID_JSON,

      shouldButtonBeDisabled: true,
    },
    {
      path: MOCK_PATH_VALID,

      shouldButtonBeDisabled: true,
    },
    { selectedOkmsId: MOCK_OKMS_ID, shouldButtonBeDisabled: true },
    {
      data: MOCK_DATA_VALID_JSON,
      path: MOCK_PATH_VALID,

      shouldButtonBeDisabled: true,
    },
    {
      data: MOCK_DATA_VALID_JSON,
      path: MOCK_PATH_VALID,
      selectedOkmsId: MOCK_OKMS_ID,
      shouldButtonBeDisabled: false,
    },
  ])(
    'should check the form validity for data: $data, path: $path and a selectedOkms: $selectedOkmsId',
    async ({ data, path, selectedOkmsId, shouldButtonBeDisabled }) => {
      // GIVEN
      const user = userEvent.setup();
      await renderSecretForm(selectedOkmsId);
      await assertTextVisibility(labels.secretManager.create_secret_form_secret_section_title);

      // WHEN
      await clickJsonEditorToggle(user);

      if (path) {
        await changeOdsInputValueByTestId(SECRET_FORM_TEST_IDS.INPUT_PATH, path);
      }
      if (data) {
        const input = await screen.findByTestId(SECRET_FORM_FIELD_TEST_IDS.INPUT_DATA);

        // clean first the input
        await act(() => user.clear(input));
        // then type the new value
        const escaped = data.replace(/{/g, '{{');
        await act(() => user.type(input, escaped));
      }

      // THEN
      const submitButton = screen.getByTestId(SECRET_FORM_TEST_IDS.SUBMIT_BUTTON);
      expect(submitButton).toBeInTheDocument();

      await waitFor(() =>
        shouldButtonBeDisabled
          ? expect(submitButton).toBeDisabled()
          : expect(submitButton).toBeEnabled(),
      );
    },
  );
});
