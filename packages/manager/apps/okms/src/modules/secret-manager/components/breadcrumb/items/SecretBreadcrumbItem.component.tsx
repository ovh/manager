import { useHref } from 'react-router-dom';

import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';

import { OdsBreadcrumbItem } from '@ovhcloud/ods-components/react';

import { useRequiredParams } from '@/common/hooks/useRequiredParams';

import { BREADCRUMB_ITEM_TEST_IDS } from './BreadcrumbItem.constants';

const Item = ({ okmsId, secretPath }: { okmsId: string; secretPath: string }) => {
  const link = useHref(SECRET_MANAGER_ROUTES_URLS.secret(okmsId, secretPath));

  return (
    <OdsBreadcrumbItem
      data-testid={BREADCRUMB_ITEM_TEST_IDS.SECRET}
      key={okmsId}
      label={decodeSecretPath(secretPath)}
      href={link}
    />
  );
};

export const SecretBreadcrumbItem = () => {
  const { okmsId, secretPath } = useRequiredParams('okmsId', 'secretPath');

  return <Item okmsId={okmsId} secretPath={secretPath} />;
};
