import { OKMS } from '@key-management-service/types/okms.type';
import { useTranslation } from 'react-i18next';

import { ManagerTile } from '@ovh-ux/manager-react-components';

import { useProductType } from '@/common/hooks/useProductType';

import { SecretCountTileItem } from './items/SecretCountTileItem.component';
import { SecretListLinkTileItem } from './items/SecretListLinkTileItem.component';
import { SecretVersionCountTileItem } from './items/SecretVersionCountTileItem.component';

type SecretsTileProps = {
  okms: OKMS;
};

export const SecretsTile = ({ okms }: SecretsTileProps) => {
  const { t } = useTranslation('key-management-service/listing');

  const productType = useProductType();

  return (
    <ManagerTile>
      <ManagerTile.Title>{t('key_management_service_listing_secret_cell')}</ManagerTile.Title>
      <ManagerTile.Divider />
      <SecretCountTileItem okms={okms} />
      <ManagerTile.Divider />
      <SecretVersionCountTileItem okms={okms} />
      {productType === 'key-management-service' && (
        <>
          <ManagerTile.Divider />
          <SecretListLinkTileItem okms={okms} />
        </>
      )}
    </ManagerTile>
  );
};
