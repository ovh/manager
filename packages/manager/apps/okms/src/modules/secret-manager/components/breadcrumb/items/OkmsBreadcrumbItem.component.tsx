import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OdsBreadcrumbItem, OdsSkeleton } from '@ovhcloud/ods-components/react';
import {
  LocationPathParams,
  SECRET_MANAGER_ROUTES_URLS,
} from '@secret-manager/routes/routes.constants';
import { OKMS_BREADCRUMB_ITEM_TEST_ID } from '@secret-manager/utils/tests/breadcrumb.constants';
import { isLocationParamsDefined } from '@secret-manager/utils/locationParams';
import { useOkmsById } from '@/data/hooks/useOkms';

const Item = ({ okmsId }: { okmsId: string }) => {
  const navigate = useNavigate();

  const { data: okms, isPending, error } = useOkmsById(okmsId);

  if (isPending)
    return (
      <div className="flex items-center">
        <OdsSkeleton className="w-9" />
      </div>
    );

  return (
    <OdsBreadcrumbItem
      data-testid={OKMS_BREADCRUMB_ITEM_TEST_ID}
      key={okmsId}
      label={error ? okmsId : okms?.data?.iam?.displayName || okmsId}
      onClick={() => navigate(SECRET_MANAGER_ROUTES_URLS.secretList(okmsId))}
      href={null}
    />
  );
};

export const OkmsBreadcrumbItem = () => {
  const { okmsId } = useParams<LocationPathParams>();

  return isLocationParamsDefined([okmsId]) ? <Item okmsId={okmsId} /> : null;
};
