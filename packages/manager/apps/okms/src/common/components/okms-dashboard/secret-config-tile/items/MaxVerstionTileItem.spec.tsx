import { mockSecretConfigOkms } from '@secret-manager/mocks/secret-config-okms/secretConfigOkms.mock';
import { screen } from '@testing-library/react';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderWithI18n } from '@/common/utils/tests/testUtils';

import { SECRET_CONFIG_TILE_TEST_IDS } from '../SecretConfigTile.constants';
import { MaxVersionTileItem, MaxVersionTileItemProps } from './MaxVersionTileItem.component';

const buildProps = (props: Partial<MaxVersionTileItemProps> = {}): MaxVersionTileItemProps => {
  return props as MaxVersionTileItemProps;
};

const renderTileItem = async (secretConfigOkmsQuery: MaxVersionTileItemProps) => {
  return renderWithI18n(<MaxVersionTileItem {...secretConfigOkmsQuery} />);
};

describe('OKMS - secret config - max version Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    // GIVEN

    // WHEN
    await renderTileItem(
      buildProps({ data: mockSecretConfigOkms, isPending: false, isError: false }),
    );

    // THEN
    expect(screen.getByText(labels.secretManager.maximum_number_of_versions)).toBeVisible();
    expect(screen.getByText(mockSecretConfigOkms.maxVersions)).toBeVisible();
  });

  it('should render a skeleton while data is loading', async () => {
    // GIVEN

    // WHEN
    await renderTileItem(buildProps({ isPending: true, isError: false, data: undefined }));

    // THEN
    expect(screen.getByTestId(SECRET_CONFIG_TILE_TEST_IDS.skeleton)).toBeInTheDocument();
  });
});
