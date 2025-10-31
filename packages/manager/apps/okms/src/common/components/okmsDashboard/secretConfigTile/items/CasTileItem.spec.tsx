import { screen } from '@testing-library/react';
import React from 'react';
import { mockSecretConfigOkms } from '@secret-manager/mocks/secretConfigOkms/secretConfigOkms.mock';
import { SecretConfig } from '@secret-manager/types/secret.type';
import { labels } from '@/common/utils/tests/init.i18n';
import { SECRET_CONFIG_TILE_TEST_IDS } from '../SecretConfigTile.constants';
import { CasTileItem } from './CasTileItem.component';
import { renderWithI18n } from '@/common/utils/tests/testUtils';

const renderTileItem = async ({
  isPending = false,
  secretConfig,
}: {
  isPending?: boolean;
  secretConfig?: SecretConfig;
}) => {
  return renderWithI18n(
    <CasTileItem secretConfig={secretConfig} isPending={isPending} />,
  );
};

describe('OKMS - secret config - cas item Tile Item test suite', () => {
  type UseCases = {
    secretConfig: SecretConfig;
    label: string;
  };
  const useCases: UseCases[] = [
    {
      secretConfig: { ...mockSecretConfigOkms, casRequired: true },
      label: labels.secretManager.activated,
    },
    {
      secretConfig: { ...mockSecretConfigOkms, casRequired: false },
      label: labels.common.status.disabled,
    },
  ];

  it.each(useCases)(
    'should render the tile item correctly',
    async ({ label, secretConfig }) => {
      // GIVEN

      // WHEN
      await renderTileItem({ secretConfig, isPending: false });

      // THEN
      expect(
        screen.getByText(labels.secretManager.cas_with_description),
      ).toBeVisible();
      expect(
        screen.getByText(labels.secretManager.cas_with_description_tooltip),
      ).toBeVisible();
      expect(screen.getByText(label)).toBeVisible();
    },
  );

  it('should render a skeleton while data is loading', async () => {
    // GIVEN

    // WHEN
    await renderTileItem({ isPending: true });

    // THEN
    expect(
      screen.getByTestId(SECRET_CONFIG_TILE_TEST_IDS.skeleton),
    ).toBeInTheDocument();
  });
});
