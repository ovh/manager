import { OKMS } from '@key-management-service/types/okms.type';
import { secretConfigOkmsQueryKey } from '@secret-manager/data/api/secretConfigOkms';
import { useSecretConfigOkms } from '@secret-manager/data/hooks/useSecretConfigOkms';
import { useTranslation } from 'react-i18next';

import { ManagerTile } from '@ovh-ux/manager-react-components';
import { queryClient } from '@ovh-ux/manager-react-core-application';

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

  const { data: secretConfig, isPending, error } = useSecretConfigOkms(okms.id);

  const handleRetry = () => {
    void queryClient.refetchQueries({
      queryKey: secretConfigOkmsQueryKey(okms.id),
    });
  };

  return (
    <ManagerTile>
      <ManagerTile.Title>{t('okms_secret_config')}</ManagerTile.Title>
      {error ? (
        <>
          <ManagerTile.Divider />
          <TileError error={error} onRetry={handleRetry} />
        </>
      ) : (
        <>
          <ManagerTile.Divider />
          <MaxVersionTileItem secretConfig={secretConfig} isPending={isPending} />
          <ManagerTile.Divider />
          <DeactivateVersionAfterTileItem secretConfig={secretConfig} isPending={isPending} />
          <ManagerTile.Divider />
          <CasTileItem secretConfig={secretConfig} isPending={isPending} />
          {productType === 'secret-manager' && (
            <>
              <ManagerTile.Divider />
              <EditSecretConfigLinkTileItem okms={okms} />
            </>
          )}
        </>
      )}
    </ManagerTile>
  );
};
