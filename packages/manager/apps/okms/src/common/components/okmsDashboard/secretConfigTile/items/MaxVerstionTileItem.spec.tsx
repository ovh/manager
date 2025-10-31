import { screen } from '@testing-library/react';
import React from 'react';
import { mockSecretConfigOkms } from '@secret-manager/mocks/secretConfigOkms/secretConfigOkms.mock';
import { labels } from '@/common/utils/tests/init.i18n';
import { MaxVersionTileItem } from './MaxVersionTileItem.component';
import { SECRET_CONFIG_TILE_TEST_IDS } from '../SecretConfigTile.constants';
import { renderWithI18n } from '@/common/utils/tests/testUtils';

const renderTileItem = async ({
  isPending = false,
}: {
  isPending?: boolean;
}) => {
  return renderWithI18n(
    <MaxVersionTileItem
      secretConfig={mockSecretConfigOkms}
      isPending={isPending}
    />,
  );
};

describe('OKMS - secret config - max version Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    // GIVEN

    // WHEN
    await renderTileItem({});

    // THEN
    expect(
      screen.getByText(labels.secretManager.maximum_number_of_versions),
    ).toBeVisible();
    expect(screen.getByText(mockSecretConfigOkms.maxVersions)).toBeVisible();
  });

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
