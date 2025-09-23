import React from 'react';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { getOdsButtonByLabel } from '@ovh-ux/manager-core-test-utils';
import { waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import {
  SECRET_MANAGER_ROUTES_URLS,
  SECRET_MANAGER_SEARCH_PARAMS,
} from '@secret-manager/routes/routes.constants';
import { initTestI18n, labels } from '@/utils/tests/init.i18n';
import { SecretFormBackLink } from './BackLink.component';

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

const renderBackLink = async () => {
  const queryClient = new QueryClient();
  if (!i18nValue) {
    i18nValue = await initTestI18n();
  }

  return render(
    <I18nextProvider i18n={i18nValue}>
      <QueryClientProvider client={queryClient}>
        <SecretFormBackLink />
      </QueryClientProvider>
    </I18nextProvider>,
  );
};

const MOCK_OKMS_ID = 'bc8673d4-6315-48a2-9251-c6d30ebf41b8';

describe('Secrets creation form test suite', () => {
  it.each([
    {
      okmsId: undefined,
      href: SECRET_MANAGER_ROUTES_URLS.root,
    },
    {
      okmsId: MOCK_OKMS_ID,
      href: SECRET_MANAGER_ROUTES_URLS.secretList(MOCK_OKMS_ID),
    },
  ])(
    'backlink should have attribute href: $href if okmsId search param is $okmsId',
    async ({ okmsId, href }) => {
      // GIVEN
      if (okmsId) {
        const urlParams = new URLSearchParams();
        urlParams.set(SECRET_MANAGER_SEARCH_PARAMS.okmsId, okmsId);
        vi.mocked(useSearchParams).mockReturnValueOnce([urlParams, vi.fn()]);
      }

      const { container } = await renderBackLink();

      // WHEN
      const backLink = await getOdsButtonByLabel({
        container,
        label: labels.common.actions.back,
        isLink: true,
      });

      // THEN
      await waitFor(() => expect(backLink).toHaveAttribute('href', href));
    },
  );
});
