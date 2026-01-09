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

import { BREADCRUMB_ITEM_TEST_IDS } from './BreadcrumbItem.constants';

export const RootBreadcrumbItem = () => {
  const link = useHref(SECRET_MANAGER_ROUTES_URLS.root);
  const { t } = useTranslation('secret-manager');

  return (
    <OdsBreadcrumbItem
      data-testid={BREADCRUMB_ITEM_TEST_IDS.ROOT}
      key={SECRET_MANAGER_ROUTES_URIS.root}
    >
      <OdsBreadcrumbLink href={link}>{t('secret_manager')}</OdsBreadcrumbLink>
    </OdsBreadcrumbItem>
  );
};
