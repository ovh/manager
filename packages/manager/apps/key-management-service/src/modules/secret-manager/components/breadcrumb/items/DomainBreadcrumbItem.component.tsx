import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OdsBreadcrumbItem, OdsSkeleton } from '@ovhcloud/ods-components/react';
import {
  LocationPathParams,
  SECRET_MANAGER_ROUTES_URLS,
} from '@secret-manager/routes/routes.constants';
import { DOMAIN_BREADCRUMB_ITEM_TEST_ID } from '@secret-manager/utils/tests/breadcrumb.constants';
import { isLocationParamsDefined } from '@secret-manager/utils/locationParams';
import { useOkmsById } from '@/data/hooks/useOkms';

const Item = ({ domainId }: { domainId: string }) => {
  const navigate = useNavigate();

  const { data: okms, isPending, error } = useOkmsById(domainId);

  if (isPending)
    return (
      <div className="flex items-center">
        <OdsSkeleton className="w-9" />
      </div>
    );

  return (
    <OdsBreadcrumbItem
      data-testid={DOMAIN_BREADCRUMB_ITEM_TEST_ID}
      key={domainId}
      label={error ? domainId : okms?.data?.iam?.displayName || domainId}
      onClick={() =>
        navigate(SECRET_MANAGER_ROUTES_URLS.secretListing(domainId))
      }
      href={null}
    />
  );
};

export const DomainBreadcrumbItem = () => {
  const { domainId } = useParams<LocationPathParams>();

  return isLocationParamsDefined([domainId]) ? (
    <Item domainId={domainId} />
  ) : null;
};
