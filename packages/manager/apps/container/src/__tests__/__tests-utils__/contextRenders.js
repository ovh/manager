import React from 'react';
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { shell as shellApi } from '@ovh-ux/shell';

import i18n from '../config/i18nTestConfig';
import { ApplicationProvider } from '@/context';
import { NotificationsProvider } from '@/core/notifications';

export const renderWithI18n = (children, { ...renderOptions }) => {
  return render(
    <I18nextProvider i18n={i18n}>{children}</I18nextProvider>,
    renderOptions,
  );
};

export const renderWithShell = async (
  children,
  { environment, ...renderOptions },
) => {
  const shell = await shellApi.initShell();

  return render(
    <I18nextProvider i18n={i18n}>
      <ApplicationProvider environment={environment} shell={shell}>
        {children}
      </ApplicationProvider>
    </I18nextProvider>,
    renderOptions,
  );
};

export const renderWithNotifications = async (
  children,
  { environment, ...renderOptions },
) => {
  const shell = await shellApi.initShell();

  return render(
    <I18nextProvider i18n={i18n}>
      <ApplicationProvider environment={environment} shell={shell}>
        <NotificationsProvider environment={environment}>
          {children}
        </NotificationsProvider>
      </ApplicationProvider>
    </I18nextProvider>,
    renderOptions,
  );
};
