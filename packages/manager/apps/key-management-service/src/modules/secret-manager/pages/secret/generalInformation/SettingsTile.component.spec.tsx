import React from 'react';
import { describe } from 'vitest';
import { screen, render } from '@testing-library/react';
import { secretListMock } from '@secret-manager/mocks/secrets/secrets.mock';
import { Secret } from '@secret-manager/types/secret.type';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { SettingsTile } from './SettingsTile.component';
import { initTestI18n, labels } from '@/utils/tests/init.i18n';

let i18nValue: i18n;
const mockSecret = secretListMock[0];

const renderSettingTile = async () => {
  if (!i18nValue) {
    i18nValue = await initTestI18n();
  }

  const { container } = render(
    <I18nextProvider i18n={i18nValue}>
      <SettingsTile secret={mockSecret} />
    </I18nextProvider>,
  );

  return { container };
};

describe('Secrets Settings Tile component tests suite', () => {
  test('Should display settings tile with all data', async () => {
    await renderSettingTile();

    const labelList = [
      labels.secretManager.settings,
      mockSecret.metadata.deactivateVersionAfter,
      labels.secretManager.maximum_number_of_versions,
      mockSecret.metadata.maxVersions,
      labels.secretManager.cas_with_description,
    ];

    labelList.forEach((label) => {
      expect(screen.getByText(label)).toBeVisible();
    });
  });

  test('Should display "not provided" when data is not available', async () => {
    const secret: Secret = {
      ...mockSecret,
      metadata: {
        ...mockSecret.metadata,
        deactivateVersionAfter: undefined,
        maxVersions: undefined,
      },
    };
    render(<SettingsTile secret={secret} />);

    expect(screen.getAllByText('not_provided')).toHaveLength(2);
  });
});
