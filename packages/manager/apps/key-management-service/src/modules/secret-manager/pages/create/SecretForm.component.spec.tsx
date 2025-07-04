import React from 'react';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { waitFor } from '@testing-library/dom';
import {
  DATA_INPUT_TEST_ID,
  DATA_VALID_JSON,
  PATH_INPUT_TEST_ID,
  PATH_VALID,
  SUBMIT_BTN_TEST_ID,
} from '@secret-manager/utils/tests/secret.constant';
import { fireEvent, act, render } from '@testing-library/react';
import { labels, initTestI18n } from '@/utils/tests/init.i18n';
import { SecretForm } from './SecretForm.component';

let i18nValue: i18n;

vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => vi.fn(),
    useHref: () => vi.fn(),
    useSearchParams: vi.fn(),
  };
});

vi.mocked(useSearchParams).mockReturnValue([new URLSearchParams(), vi.fn()]);

const renderSecretForm = async (domainId?: string) => {
  const queryClient = new QueryClient();
  if (!i18nValue) {
    i18nValue = await initTestI18n();
  }

  return render(
    <I18nextProvider i18n={i18nValue}>
      <QueryClientProvider client={queryClient}>
        <SecretForm domainId={domainId} />
      </QueryClientProvider>
    </I18nextProvider>,
  );
};

const DOMAIN_ID = 'a1c3e7f8-5fc5-4c4e-8eac-60076ac25c00';

type TestCase = {
  path?: string;
  data?: string;
  selectedDomainId?: string;
  shouldButtonBeDisabled: boolean;
};

const testCases: TestCase[] = [
  { shouldButtonBeDisabled: true },
  {
    data: DATA_VALID_JSON,

    shouldButtonBeDisabled: true,
  },
  {
    path: PATH_VALID,

    shouldButtonBeDisabled: true,
  },
  { selectedDomainId: DOMAIN_ID, shouldButtonBeDisabled: true },
  {
    data: DATA_VALID_JSON,
    path: PATH_VALID,

    shouldButtonBeDisabled: true,
  },
  {
    data: DATA_VALID_JSON,
    path: PATH_VALID,
    selectedDomainId: DOMAIN_ID,
    shouldButtonBeDisabled: false,
  },
];

describe('Secrets creation form test suite', () => {
  it.each(testCases)(
    'should check the form validity for data: $data, path: $path and a selectedDomain: $selectedDomainId ',
    async ({ data, path, selectedDomainId, shouldButtonBeDisabled }) => {
      // GIVEN
      const { getByTestId } = await renderSecretForm(selectedDomainId);
      await assertTextVisibility(
        labels.secretManager.create.secret_section_title,
      );

      const inputPath = getByTestId(PATH_INPUT_TEST_ID);
      expect(inputPath).toBeInTheDocument();
      const inputData = getByTestId(DATA_INPUT_TEST_ID);
      expect(inputData).toBeInTheDocument();
      const submitButton = getByTestId(SUBMIT_BTN_TEST_ID);
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('is-disabled', 'true');

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
      await waitFor(
        () => {
          expect(submitButton).toHaveAttribute(
            'is-disabled',
            shouldButtonBeDisabled.toString(),
          );
        },
        {
          timeout: 5_000,
        },
      );
    },
  );
});
