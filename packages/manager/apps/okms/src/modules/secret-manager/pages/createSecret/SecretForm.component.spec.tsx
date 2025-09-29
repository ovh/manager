import React from 'react';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { waitFor } from '@testing-library/dom';
import {
  MOCK_DATA_VALID_JSON,
  MOCK_PATH_VALID,
} from '@secret-manager/utils/tests/secret.constants';
import { SECRET_FORM_TEST_IDS } from '@secret-manager/pages/createSecret/SecretForm.constants';
import { SECRET_INPUT_DATA_TEST_ID } from '@secret-manager/components/form/SecretDataFormField.constants';
import { fireEvent, act, render, screen } from '@testing-library/react';
import { labels, initTestI18n } from '@/utils/tests/init.i18n';
import { SecretForm } from './SecretForm.component';
import { SECRET_DATA_TEMPLATE } from './SecretForm.constants';

let i18nValue: i18n;

vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => vi.fn(),
    useHref: vi.fn((link) => link),
    useSearchParams: vi.fn(),
  };
});

vi.mocked(useSearchParams).mockReturnValue([new URLSearchParams(), vi.fn()]);

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
    'should check the form validity for data: $data, path: $path and a selectedOkms: $selectedOkmsId ',
    async ({ data, path, selectedOkmsId, shouldButtonBeDisabled }) => {
      // GIVEN
      await renderSecretForm(selectedOkmsId);
      await assertTextVisibility(
        labels.secretManager.create_secret_form_secret_section_title,
      );

      const inputPath = screen.getByTestId(SECRET_FORM_TEST_IDS.INPUT_PATH);
      expect(inputPath).toBeInTheDocument();
      const inputData = screen.getByTestId(SECRET_INPUT_DATA_TEST_ID);
      expect(inputData).toBeInTheDocument();
      const submitButton = screen.getByTestId(
        SECRET_FORM_TEST_IDS.SUBMIT_BUTTON,
      );
      expect(submitButton).toBeInTheDocument();

      // WHEN
      act(() => {
        fireEvent.input(inputPath, {
          target: { value: path },
        });

        fireEvent.change(inputData, {
          target: { value: data },
        });
      });

      // THEN
      await waitFor(() =>
        shouldButtonBeDisabled
          ? expect(submitButton).toBeDisabled()
          : expect(submitButton).toBeEnabled(),
      );
    },
  );

  it('should display the template in the data input', async () => {
    // GIVEN
    await renderSecretForm(MOCK_OKMS_ID);
    const inputData = screen.getByTestId(SECRET_INPUT_DATA_TEST_ID);
    expect(inputData).toBeInTheDocument();

    // THEN
    expect(inputData).toHaveValue(SECRET_DATA_TEMPLATE);
  });
});
