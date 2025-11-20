import { useNavigate } from 'react-router-dom';

import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { isLocationParamsDefined } from '@secret-manager/utils/locationParams';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';

import { OdsBreadcrumbItem } from '@ovhcloud/ods-components/react';

import { useRequiredParams } from '@/common/hooks/useRequiredParams';

import { BREADCRUMB_ITEM_TEST_IDS } from './BreadcrumbItem.constants';

const Item = ({ okmsId, secretPath }: { okmsId: string; secretPath: string }) => {
  const navigate = useNavigate();

  return (
    <OdsBreadcrumbItem
      data-testid={BREADCRUMB_ITEM_TEST_IDS.SECRET}
      key={okmsId}
      label={decodeSecretPath(secretPath)}
      onClick={() => navigate(SECRET_MANAGER_ROUTES_URLS.secret(okmsId, secretPath))}
      href=""
    />
  );
};

export const SecretBreadcrumbItem = () => {
  const { okmsId, secretPath } = useRequiredParams('okmsId', 'secretPath');

  return isLocationParamsDefined([okmsId, secretPath]) ? (
    <Item okmsId={okmsId} secretPath={secretPath} />
  ) : null;
};
