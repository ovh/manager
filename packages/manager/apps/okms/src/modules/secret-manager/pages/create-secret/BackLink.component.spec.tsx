import { MemoryRouter, useSearchParams } from 'react-router-dom';

import {
  SECRET_MANAGER_ROUTES_URLS,
  SECRET_MANAGER_SEARCH_PARAMS,
} from '@secret-manager/routes/routes.constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { waitFor } from '@testing-library/dom';
import { render, screen } from '@testing-library/react';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { vi } from 'vitest';

import { initTestI18n, labels } from '@/common/utils/tests/init.i18n';

import { SecretFormBackLink } from './BackLink.component';

let i18nValue: i18n;

vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => vi.fn(),
    useSearchParams: vi.fn(),
  };
});

const renderBackLink = async () => {
  const queryClient = new QueryClient();
  if (!i18nValue) {
    i18nValue = await initTestI18n();
  }

  return render(
    <MemoryRouter>
      <I18nextProvider i18n={i18nValue}>
        <QueryClientProvider client={queryClient}>
          <SecretFormBackLink />
        </QueryClientProvider>
      </I18nextProvider>
    </MemoryRouter>,
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
      const urlParams = new URLSearchParams();
      if (okmsId) {
        urlParams.set(SECRET_MANAGER_SEARCH_PARAMS.okmsId, okmsId);
      }
      vi.mocked(useSearchParams).mockReturnValue([urlParams, vi.fn()]);

      await renderBackLink();

      // WHEN
      const backLink = await screen.findByText(labels.common.actions.back);

      // THEN (Muk Link renders "to" in test env, not "href")
      await waitFor(() => {
        const linkTarget = backLink.getAttribute('to');
        expect(linkTarget).toBe(href);
      });
    },
  );
});
