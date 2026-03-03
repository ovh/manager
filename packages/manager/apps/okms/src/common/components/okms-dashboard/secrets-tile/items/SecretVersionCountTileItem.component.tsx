import { OKMS } from '@key-management-service/types/okms.type';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { Tile } from '@ovh-ux/muk';

import { SECRETS_TILE_TEST_IDS } from '../SecretsTile.constants';

type SecretVersionCountTileItemProps = {
  okms: OKMS;
  divider?: boolean;
};

export const SecretVersionCountTileItem = ({
  okms,
  divider = true,
}: SecretVersionCountTileItemProps) => {
  const { t } = useTranslation('key-management-service/dashboard');

  return (
    <Tile.Item.Root>
      <Tile.Item.Term label={t('okms_secret_version_count')} />
      <Tile.Item.Description divider={divider}>
        <Text preset="span" data-testid={SECRETS_TILE_TEST_IDS.secretVersionCount}>
          {okms.secretVersionCount}
        </Text>
      </Tile.Item.Description>
    </Tile.Item.Root>
  );
};
