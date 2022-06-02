import React from 'react';
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { initShell } from '@ovh-ux/shell';

import i18n from '../config/i18nTestConfig';
import { ApplicationProvider } from '../../context';
import { NotificationsProvider } from '../../core/notifications';
import { ContainerProvider } from '../../core/container';

const renderWithI18n = (children, { ...renderOptions }) => {
  return render(
    <I18nextProvider i18n={i18n}>{children}</I18nextProvider>,
    renderOptions,
  );
};

const renderWithShell = async (children, { environment, ...renderOptions }) => {
  const shell = await initShell();

  return render(
    <I18nextProvider i18n={i18n}>
      <ApplicationProvider environment={environment} shell={shell}>
        <ContainerProvider>{children}</ContainerProvider>
      </ApplicationProvider>
    </I18nextProvider>,
    renderOptions,
  );
};

const renderWithNotifications = async (
  children,
  { environment, ...renderOptions },
) => {
  const shell = await initShell();

  return render(
    <I18nextProvider i18n={i18n}>
      <ApplicationProvider environment={environment} shell={shell}>
        <NotificationsProvider environment={environment}>
          <ContainerProvider>{children}</ContainerProvider>
        </NotificationsProvider>
      </ApplicationProvider>
    </I18nextProvider>,
    renderOptions,
  );
};

export { renderWithI18n, renderWithShell, renderWithNotifications };
