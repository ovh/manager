import { useHref } from 'react-router-dom';

import {
  SECRET_MANAGER_ROUTES_URIS,
  SECRET_MANAGER_ROUTES_URLS,
} from '@secret-manager/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import { BreadcrumbItem, BreadcrumbLink } from '@ovhcloud/ods-react';

import { BREADCRUMB_ITEM_TEST_IDS } from './BreadcrumbItem.constants';

export const CreateSecretBreadcrumbItem = () => {
  const link = useHref(SECRET_MANAGER_ROUTES_URLS.createSecret);
  const { t } = useTranslation('secret-manager');

  return (
    <BreadcrumbItem
      data-testid={BREADCRUMB_ITEM_TEST_IDS.CREATE_SECRET}
      key={SECRET_MANAGER_ROUTES_URIS.root}
    >
      <BreadcrumbLink href={link}>{t('create_a_secret')}</BreadcrumbLink>
    </BreadcrumbItem>
  );
};
