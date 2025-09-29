import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OdsBreadcrumbItem } from '@ovhcloud/ods-components/react';
import {
  SECRET_MANAGER_ROUTES_URIS,
  SECRET_MANAGER_ROUTES_URLS,
} from '@secret-manager/routes/routes.constants';
import { useTranslation } from 'react-i18next';
import { BREADCRUMB_ITEM_TEST_IDS } from './BreadcrumbItem.constants';

export const RootBreadcrumbItem = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('secret-manager');

  return (
    <OdsBreadcrumbItem
      data-testid={BREADCRUMB_ITEM_TEST_IDS.ROOT}
      key={SECRET_MANAGER_ROUTES_URIS.root}
      label={t('secret_manager')}
      onClick={() => navigate(SECRET_MANAGER_ROUTES_URLS.root)}
      href={null}
    />
  );
};
