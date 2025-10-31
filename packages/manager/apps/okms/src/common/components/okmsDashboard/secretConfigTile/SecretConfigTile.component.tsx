import React from 'react';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useSecretConfigOkms } from '@secret-manager/data/hooks/useSecretConfigOkms';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import { secretConfigOkmsQueryKey } from '@secret-manager/data/api/secretConfigOkms';
import { OKMS } from '@key-management-service/types/okms.type';
import { MaxVersionTileItem } from './items/MaxVersionTileItem.component';
import { DeactivateVersionAfterTileItem } from './items/DeactivateVersionAfterTileItem.component';
import { CasTileItem } from './items/CasTileItem.component';
import { TileError } from '@/common/components/tileError/TileError.component';

type SecretConfigTileProps = {
  okms: OKMS;
};

export const SecretConfigTile = ({ okms }: SecretConfigTileProps) => {
  const { t } = useTranslation('key-management-service/dashboard');

  const { data: secretConfig, isPending, error } = useSecretConfigOkms(okms.id);

  return (
    <ManagerTile>
      <ManagerTile.Title>{t('okms_secret_config')}</ManagerTile.Title>
      {error ? (
        <>
          <ManagerTile.Divider />
          <TileError
            error={error}
            onRetry={() =>
              queryClient.refetchQueries({
                queryKey: secretConfigOkmsQueryKey(okms.id),
              })
            }
          />
        </>
      ) : (
        <>
          <ManagerTile.Divider />
          <MaxVersionTileItem
            secretConfig={secretConfig}
            isPending={isPending}
          />
          <ManagerTile.Divider />
          <DeactivateVersionAfterTileItem
            secretConfig={secretConfig}
            isPending={isPending}
          />
          <ManagerTile.Divider />
          <CasTileItem secretConfig={secretConfig} isPending={isPending} />
        </>
      )}
    </ManagerTile>
  );
};
