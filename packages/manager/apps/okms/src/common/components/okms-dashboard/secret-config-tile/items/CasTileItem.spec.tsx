import { mockSecretConfigOkms } from '@secret-manager/mocks/secret-config-okms/secretConfigOkms.mock';
import { SecretConfig } from '@secret-manager/types/secret.type';
import { screen } from '@testing-library/react';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderWithI18n } from '@/common/utils/tests/testUtils';

import { SECRET_CONFIG_TILE_TEST_IDS } from '../SecretConfigTile.constants';
import { CasTileItem, CasTileItemProps } from './CasTileItem.component';

const buildProps = (props: Partial<CasTileItemProps> = {}): CasTileItemProps => {
  return props as CasTileItemProps;
};

const renderTileItem = async (secretConfigOkmsQuery: CasTileItemProps) => {
  return renderWithI18n(<CasTileItem {...secretConfigOkmsQuery} />);
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

  it.each(useCases)('should render the tile item correctly', async ({ label, secretConfig }) => {
    // GIVEN

    // WHEN
    await renderTileItem(buildProps({ data: secretConfig, isPending: false, isError: false }));

    // THEN
    expect(screen.getByText(labels.secretManager.cas_with_description)).toBeInTheDocument();
    expect(screen.getByText(labels.secretManager.cas_with_description_tooltip)).toBeInTheDocument();
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('should render a skeleton while data is loading', async () => {
    // GIVEN

    // WHEN
    await renderTileItem(buildProps({ isPending: true, isError: false, data: undefined }));

    // THEN
    expect(screen.getByTestId(SECRET_CONFIG_TILE_TEST_IDS.skeleton)).toBeInTheDocument();
  });
});
