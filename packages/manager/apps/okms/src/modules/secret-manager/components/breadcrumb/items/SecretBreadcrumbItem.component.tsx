import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OdsBreadcrumbItem } from '@ovhcloud/ods-components/react';
import {
  LocationPathParams,
  SECRET_MANAGER_ROUTES_URLS,
} from '@secret-manager/routes/routes.constants';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { isLocationParamsDefined } from '@secret-manager/utils/locationParams';
import { BREADCRUMB_ITEM_TEST_IDS } from './BreadcrumbItem.constants';

const Item = ({
  okmsId,
  secretPath,
}: {
  okmsId: string;
  secretPath: string;
}) => {
  const navigate = useNavigate();

  return (
    <OdsBreadcrumbItem
      data-testid={BREADCRUMB_ITEM_TEST_IDS.SECRET}
      key={okmsId}
      label={decodeSecretPath(secretPath)}
      onClick={() =>
        navigate(SECRET_MANAGER_ROUTES_URLS.secret(okmsId, secretPath))
      }
      href={null}
    />
  );
};

export const SecretBreadcrumbItem = () => {
  const { okmsId, secretPath } = useParams<LocationPathParams>();

  return isLocationParamsDefined([okmsId, secretPath]) ? (
    <Item okmsId={okmsId} secretPath={secretPath} />
  ) : null;
};
