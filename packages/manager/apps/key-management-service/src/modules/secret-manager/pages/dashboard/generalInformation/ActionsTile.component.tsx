import React from 'react';
import {
  ManagerButton,
  ManagerLink,
  ManagerTile,
} from '@ovh-ux/manager-react-components';
import { Secret } from '@secret-manager/types/secret.type';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { SecretListingPageParams } from '@secret-manager/pages/listing/listing.type';
import { useHref, useParams } from 'react-router-dom';

type ActionsTileParams = {
  secret: Secret;
};

export const ActionsTile = ({ secret }: ActionsTileParams) => {
  const { domainId } = useParams<SecretListingPageParams>();
  const { t } = useTranslation('secret-manager/common');

  const url = useHref(
    SECRET_MANAGER_ROUTES_URLS.secretValue(domainId, secret.path),
  );

  return (
    <ManagerTile>
      <ManagerTile.Title>{t('actions')}</ManagerTile.Title>
      <ManagerTile.Divider />
      <div className="flex flex-col gap-2">
        <ManagerLink href={url} label={t('reveal_secret')} />
      </div>
    </ManagerTile>
  );
};
