import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OdsBreadcrumbItem } from '@ovhcloud/ods-components/react';
import {
  LocationPathParams,
  SECRET_MANAGER_ROUTES_URIS,
  SECRET_MANAGER_ROUTES_URLS,
} from '@secret-manager/routes/routes.constants';
import { isLocationParamsDefined } from '@secret-manager/utils/locationParams';
import { useTranslation } from 'react-i18next';
import { BREADCRUMB_ITEM_TEST_IDS } from './BreadcrumbItem.constants';

const Item = ({ okmsId }: { okmsId: string }) => {
  const { t } = useTranslation('secret-manager');
  const navigate = useNavigate();

  return (
    <OdsBreadcrumbItem
      data-testid={BREADCRUMB_ITEM_TEST_IDS.OKMS_DASHBOARD}
      key={SECRET_MANAGER_ROUTES_URIS.dashboard}
      label={t('okms_dashboard_title')}
      onClick={() => navigate(SECRET_MANAGER_ROUTES_URLS.okmsDashboard(okmsId))}
      href={null}
    />
  );
};

export const OkmsDashboardBreadcrumbItem = () => {
  const { okmsId } = useParams<LocationPathParams>();

  return isLocationParamsDefined([okmsId]) ? <Item okmsId={okmsId} /> : null;
};
