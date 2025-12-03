import { mockSecretConfigOkms } from '@secret-manager/mocks/secret-config-okms/secretConfigOkms.mock';
import { screen } from '@testing-library/react';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderWithI18n } from '@/common/utils/tests/testUtils';

import { SECRET_CONFIG_TILE_TEST_IDS } from '../SecretConfigTile.constants';
import {
  DeactivateVersionAfterTileItem,
  DeactivateVersionAfterTileItemProps,
} from './DeactivateVersionAfterTileItem.component';

const buildProps = (
  props: Partial<DeactivateVersionAfterTileItemProps> = {},
): DeactivateVersionAfterTileItemProps => {
  return props as DeactivateVersionAfterTileItemProps;
};

const renderTileItem = async (secretConfigOkmsQuery: DeactivateVersionAfterTileItemProps) => {
  return renderWithI18n(<DeactivateVersionAfterTileItem {...secretConfigOkmsQuery} />);
};

describe('OKMS - secret config - DeactivateVersionAfter Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    // GIVEN

    // WHEN
    await renderTileItem(
      buildProps({ data: mockSecretConfigOkms, isPending: false, isError: false }),
    );

    // THEN
    expect(screen.getByText(labels.secretManager.deactivate_version_after)).toBeVisible();
    expect(screen.getByText(mockSecretConfigOkms.deactivateVersionAfter)).toBeVisible();
  });

  it('should render a skeleton while data is loading', async () => {
    // GIVEN

    // WHEN
    await renderTileItem(buildProps({ isPending: true }));

    // THEN
    expect(screen.getByTestId(SECRET_CONFIG_TILE_TEST_IDS.skeleton)).toBeInTheDocument();
  });
});
