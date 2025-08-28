import React from 'react';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import { Secret } from '@secret-manager/types/secret.type';
import { useTranslation } from 'react-i18next';
import {
  LocationPathParams,
  SECRET_MANAGER_ROUTES_URLS,
} from '@secret-manager/routes/routes.constants';
import { useParams } from 'react-router-dom';
import { Link } from '@/common/components/Link/Link.component';

type ActionsTileParams = {
  secret: Secret;
};

export const ActionsTile = ({ secret }: ActionsTileParams) => {
  const { domainId } = useParams<LocationPathParams>();
  const { t } = useTranslation('secret-manager/common');

  return (
    <ManagerTile>
      <ManagerTile.Title>{t('actions')}</ManagerTile.Title>
      <ManagerTile.Divider />
      <div className="flex flex-col gap-2">
        <Link
          href={SECRET_MANAGER_ROUTES_URLS.secretDashboardDrawerValue(
            domainId,
            secret.path,
          )}
          label={t('reveal_secret')}
          isRouterLink
        />
        <Link
          href={SECRET_MANAGER_ROUTES_URLS.secretDashboardDrawerCreateVersion(
            domainId,
            secret.path,
          )}
          label={t('add_new_version')}
          isRouterLink
        />
      </div>
    </ManagerTile>
  );
};
