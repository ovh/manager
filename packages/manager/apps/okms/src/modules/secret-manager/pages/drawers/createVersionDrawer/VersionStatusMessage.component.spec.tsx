import { render, screen } from '@testing-library/react';
import React from 'react';
import { SecretVersionState } from '@secret-manager/types/secret.type';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { VersionStatusMessage } from './VersionStatusMessage.component';
import { initTestI18n, labels } from '@/utils/tests/init.i18n';

let i18nValue: i18n;

const renderComponent = async (state: SecretVersionState) => {
  if (!i18nValue) {
    i18nValue = await initTestI18n();
  }
  return render(
    <I18nextProvider i18n={i18nValue}>
      <VersionStatusMessage state={state} />
    </I18nextProvider>,
  );
};

describe('VersionStatusMessage', () => {
  type UseCases = {
    state: SecretVersionState;
    message: string | null;
  };

  const useCases: UseCases[] = [
    { state: 'ACTIVE', message: null },
    {
      state: 'DEACTIVATED',
      message: labels.secretManager.add_new_version_no_value_message,
    },
    {
      state: 'DELETED',
      message: labels.secretManager.add_new_version_no_value_message,
    },
  ];

  it.each(useCases)(
    'should display the correct message for %s state',
    async ({ state, message }) => {
      await renderComponent(state);
      if (message) {
        expect(screen.getByText(message)).toBeInTheDocument();
      }
    },
  );
});
