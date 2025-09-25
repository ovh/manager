import React from 'react';
import { describe, vi } from 'vitest';
import { screen, render } from '@testing-library/react';
import { secretListMock } from '@secret-manager/mocks/secrets/secrets.mock';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { InformationsTile } from './InformationsTile.component';
import { PATH_LABEL, URN_LABEL } from '@/constants';
import { initTestI18n, labels } from '@/utils/tests/init.i18n';

let i18nValue: i18n;
const mockSecret = secretListMock[0];

const mockFormatDate = vi.fn((date: string) => date);
vi.mock('@/common/hooks/useFormatDate', () => ({
  useFormatDate: () => ({
    formatDate: mockFormatDate,
  }),
}));

const renderInformationTile = async () => {
  if (!i18nValue) {
    i18nValue = await initTestI18n();
  }

  const { container } = render(
    <I18nextProvider i18n={i18nValue}>
      <InformationsTile secret={mockSecret} />
    </I18nextProvider>,
  );

  return { container };
};

describe('Secrets Informations Tile component tests suite', () => {
  test('Should display settings tile with all data', async () => {
    const { container } = await renderInformationTile();

    const labelList = [
      labels.common.dashboard.general_information,
      PATH_LABEL,
      mockSecret.path,
      URN_LABEL,
      labels.common.dashboard.creation_date,
      mockSecret.metadata.createdAt,
      labels.secretManager.last_update,
      mockSecret.metadata.updatedAt,
      labels.secretManager.current_version,
      mockSecret.metadata.currentVersion,
    ];

    labelList.forEach((label) => {
      expect(screen.getByText(label)).toBeVisible();
    });

    expect(
      container.querySelector(`ods-clipboard[value="${mockSecret.iam.urn}"]`),
    ).toBeVisible();

    expect(mockFormatDate).toHaveBeenCalledWith(mockSecret.metadata.createdAt);
    expect(mockFormatDate).toHaveBeenCalledWith(mockSecret.metadata.updatedAt);
  });
});
