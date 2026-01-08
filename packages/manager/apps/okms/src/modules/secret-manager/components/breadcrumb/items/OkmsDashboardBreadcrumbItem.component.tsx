import { useHref } from 'react-router-dom';

import {
  SECRET_MANAGER_ROUTES_URIS,
  SECRET_MANAGER_ROUTES_URLS,
} from '@secret-manager/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import {
  BreadcrumbItem as OdsBreadcrumbItem,
  BreadcrumbLink as OdsBreadcrumbLink,
} from '@ovhcloud/ods-react';

import { useRequiredParams } from '@/common/hooks/useRequiredParams';

import { BREADCRUMB_ITEM_TEST_IDS } from './BreadcrumbItem.constants';

const Item = ({ okmsId }: { okmsId: string }) => {
  const { t } = useTranslation('secret-manager');
  const link = useHref(SECRET_MANAGER_ROUTES_URLS.okmsDashboard(okmsId));

  return (
    <OdsBreadcrumbItem
      data-testid={BREADCRUMB_ITEM_TEST_IDS.OKMS_DASHBOARD}
      key={SECRET_MANAGER_ROUTES_URIS.dashboard}
    >
      <OdsBreadcrumbLink href={link}>{t('okms_dashboard_title')}</OdsBreadcrumbLink>
    </OdsBreadcrumbItem>
  );
};

export const OkmsDashboardBreadcrumbItem = () => {
  const { okmsId } = useRequiredParams('okmsId');

  return <Item okmsId={okmsId} />;
};
