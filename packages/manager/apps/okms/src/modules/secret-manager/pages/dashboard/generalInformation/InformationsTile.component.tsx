import React from 'react';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import { OdsText, OdsClipboard } from '@ovhcloud/ods-components/react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { Secret } from '@secret-manager/types/secret.type';
import { useFormatDate } from '@/common/hooks/useFormatDate';

type InformationTileProps = {
  secret: Secret;
};

export const InformationsTile = ({ secret }: InformationTileProps) => {
  const { t } = useTranslation([
    'secret-manager/common',
    'secret-manager/dashboard',
    NAMESPACES.DASHBOARD,
  ]);
  const { formatDate } = useFormatDate();

  return (
    <ManagerTile>
      <ManagerTile.Title>
        {t('secret-manager/dashboard:general_information')}
      </ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t('path')}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <OdsText preset="span">{secret.path}</OdsText>
        </ManagerTile.Item.Description>
      </ManagerTile.Item>

      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t('urn')}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <OdsClipboard className="w-full" value={secret.iam.urn} />
        </ManagerTile.Item.Description>
      </ManagerTile.Item>

      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          {t('creation_date', { ns: NAMESPACES.DASHBOARD })}
        </ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <OdsText preset="span">
            {formatDate(secret.metadata.createdAt)}
          </OdsText>
        </ManagerTile.Item.Description>
      </ManagerTile.Item>

      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          {t('secret-manager/dashboard:last_update')}
        </ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <OdsText preset="span">
            {formatDate(secret.metadata.updatedAt)}
          </OdsText>
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
    </ManagerTile>
  );
};
