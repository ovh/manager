import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OdsBreadcrumbItem } from '@ovhcloud/ods-components/react';
import {
  SECRET_MANAGER_ROUTES_URIS,
  SECRET_MANAGER_ROUTES_URLS,
} from '@secret-manager/routes/routes.constants';
import { useTranslation } from 'react-i18next';
import { CREATE_SECRET_BREADCRUMB_ITEM_TEST_ID } from '@secret-manager/utils/tests/breadcrumb.constants';

export const CreateSecretBreadcrumbItem = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('secret-manager/common');

  return (
    <OdsBreadcrumbItem
      data-testid={CREATE_SECRET_BREADCRUMB_ITEM_TEST_ID}
      key={SECRET_MANAGER_ROUTES_URIS.root}
      label={t('create_secret')}
      onClick={() => navigate(SECRET_MANAGER_ROUTES_URLS.secretCreate)}
      href={null}
    />
  );
};
