import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OdsBreadcrumbItem } from '@ovhcloud/ods-components/react';
import {
  LocationPathParams,
  SECRET_MANAGER_ROUTES_URLS,
} from '@secret-manager/routes/routes.constants';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { SECRET_BREADCRUMB_ITEM_TEST_ID } from '@secret-manager/utils/tests/breadcrumb.constants';
import { isLocationParamsDefined } from '@secret-manager/utils/locationParams';

const Item = ({
  domainId,
  secretPath,
}: {
  domainId: string;
  secretPath: string;
}) => {
  const navigate = useNavigate();

  return (
    <OdsBreadcrumbItem
      data-testid={SECRET_BREADCRUMB_ITEM_TEST_ID}
      key={domainId}
      label={decodeSecretPath(secretPath)}
      onClick={() =>
        navigate(
          SECRET_MANAGER_ROUTES_URLS.secretDashboard(domainId, secretPath),
        )
      }
      href={null}
    />
  );
};

export const SecretBreadcrumbItem = () => {
  const { domainId, secretPath } = useParams<LocationPathParams>();

  return isLocationParamsDefined([domainId, secretPath]) ? (
    <Item domainId={domainId} secretPath={secretPath} />
  ) : null;
};
