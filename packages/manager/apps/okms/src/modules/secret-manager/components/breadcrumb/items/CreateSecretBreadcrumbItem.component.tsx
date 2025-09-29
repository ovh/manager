import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OdsBreadcrumbItem } from '@ovhcloud/ods-components/react';
import {
  SECRET_MANAGER_ROUTES_URIS,
  SECRET_MANAGER_ROUTES_URLS,
} from '@secret-manager/routes/routes.constants';
import { useTranslation } from 'react-i18next';
import { BREADCRUMB_ITEM_TEST_IDS } from './BreadcrumbItem.constants';

export const CreateSecretBreadcrumbItem = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('secret-manager');

  return (
    <OdsBreadcrumbItem
      data-testid={BREADCRUMB_ITEM_TEST_IDS.CREATE_SECRET}
      key={SECRET_MANAGER_ROUTES_URIS.root}
      label={t('create_a_secret')}
      onClick={() => navigate(SECRET_MANAGER_ROUTES_URLS.createSecret)}
      href={null}
    />
  );
};
