import { OKMS } from '@key-management-service/types/okms.type';
import { secretConfigOkmsQueryKey } from '@secret-manager/data/api/secretConfigOkms';
import { useSecretConfigOkms } from '@secret-manager/data/hooks/useSecretConfigOkms';
import { useTranslation } from 'react-i18next';

import { queryClient } from '@ovh-ux/manager-react-core-application';
import { Tile } from '@ovh-ux/muk';

import { TileError } from '@/common/components/tile-error/TileError.component';
import { useProductType } from '@/common/hooks/useProductType';

import { CasTileItem } from './items/CasTileItem.component';
import { DeactivateVersionAfterTileItem } from './items/DeactivateVersionAfterTileItem.component';
import { EditSecretConfigLinkTileItem } from './items/EditSecretConfigLinkTileItem.component';
import { MaxVersionTileItem } from './items/MaxVersionTileItem.component';

type SecretConfigTileProps = {
  okms: OKMS;
};

export const SecretConfigTile = ({ okms }: SecretConfigTileProps) => {
  const { t } = useTranslation('key-management-service/dashboard');
  const productType = useProductType();

  const secretConfigOkmsQuery = useSecretConfigOkms(okms.id);

  const handleRetry = () => {
    void queryClient.refetchQueries({
      queryKey: secretConfigOkmsQueryKey(okms.id),
    });
  };

  return (
    <Tile.Root title={t('okms_secret_config')}>
      {secretConfigOkmsQuery.error ? (
        <TileError error={secretConfigOkmsQuery.error} onRetry={handleRetry} />
      ) : (
        <>
          <MaxVersionTileItem {...secretConfigOkmsQuery} />
          <DeactivateVersionAfterTileItem {...secretConfigOkmsQuery} />
          <CasTileItem {...secretConfigOkmsQuery} divider={productType === 'secret-manager'} />
          {productType === 'secret-manager' && <EditSecretConfigLinkTileItem okms={okms} />}
        </>
      )}
    </Tile.Root>
  );
};
