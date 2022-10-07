import React from 'react';
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { initShell } from '@ovh-ux/shell';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import i18n from '../config/i18nTestConfig';
import { ApplicationProvider } from '../../context';
import { ContainerProvider } from '../../core/container';

const renderWithI18n = (children, { ...renderOptions }) => {
  return render(
    <I18nextProvider i18n={i18n}>{children}</I18nextProvider>,
    renderOptions,
  );
};

const renderWithShell = async (children, { environment, ...renderOptions }) => {
  const shell = await initShell();
  const queryClient = new QueryClient();

  return render(
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ApplicationProvider environment={environment} shell={shell}>
          <ContainerProvider>{children}</ContainerProvider>
        </ApplicationProvider>
      </QueryClientProvider>
    </I18nextProvider>,
    renderOptions,
  );
};

export { renderWithI18n, renderWithShell };
