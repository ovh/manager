import { Secret } from '@secret-manager/types/secret.type';
import { useTranslation } from 'react-i18next';

import { OdsClipboard, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ManagerTile } from '@ovh-ux/manager-react-components';

import { useFormatDate } from '@/common/hooks/useFormatDate';
import { PATH_LABEL, URN_LABEL } from '@/constants';

export const INFORMATIONS_TILE_TEST_IDS = {
  PATH: 'secret-path',
  URN: 'secret-urn',
  CREATED_AT: 'secret-created-at',
  UPDATED_AT: 'secret-updated-at',
};

type InformationTileProps = {
  secret: Secret;
};

export const InformationsTile = ({ secret }: InformationTileProps) => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.DASHBOARD]);
  const { formatDate } = useFormatDate();

  return (
    <ManagerTile>
      <ManagerTile.Title>
        {t('general_information', { ns: NAMESPACES.DASHBOARD })}
      </ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{PATH_LABEL}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <OdsText
            preset="span"
            data-testid={INFORMATIONS_TILE_TEST_IDS.PATH}
            // Temporary fix: wrap text without whitespace
            style={{ overflowWrap: 'anywhere' }}
          >
            {secret.path}
          </OdsText>
        </ManagerTile.Item.Description>
      </ManagerTile.Item>

      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{URN_LABEL}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <OdsClipboard
            className="w-full"
            value={secret.iam.urn}
            data-testid={INFORMATIONS_TILE_TEST_IDS.URN}
          />
        </ManagerTile.Item.Description>
      </ManagerTile.Item>

      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          {t('creation_date', { ns: NAMESPACES.DASHBOARD })}
        </ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <OdsText preset="span" data-testid={INFORMATIONS_TILE_TEST_IDS.CREATED_AT}>
            {formatDate(secret.metadata.createdAt)}
          </OdsText>
        </ManagerTile.Item.Description>
      </ManagerTile.Item>

      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t('last_update')}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <OdsText preset="span" data-testid={INFORMATIONS_TILE_TEST_IDS.UPDATED_AT}>
            {formatDate(secret?.metadata?.updatedAt ?? '')}
          </OdsText>
        </ManagerTile.Item.Description>
      </ManagerTile.Item>

      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t('current_version')}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <OdsText preset="span">{secret.metadata.currentVersion ?? t('no_version')}</OdsText>
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
    </ManagerTile>
  );
};
