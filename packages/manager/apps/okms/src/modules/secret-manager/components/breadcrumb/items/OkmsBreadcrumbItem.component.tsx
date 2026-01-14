import { useHref } from 'react-router-dom';

import { useOkmsById } from '@key-management-service/data/hooks/useOkms';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';

import { OdsBreadcrumbItem, OdsSkeleton } from '@ovhcloud/ods-components/react';

import { useRequiredParams } from '@/common/hooks/useRequiredParams';

import { BREADCRUMB_ITEM_TEST_IDS } from './BreadcrumbItem.constants';

const Item = ({ okmsId }: { okmsId: string }) => {
  const link = useHref(SECRET_MANAGER_ROUTES_URLS.secretList(okmsId));

  const { data: okms, isPending, error } = useOkmsById(okmsId);

  if (isPending)
    return (
      <div className="flex items-center">
        <OdsSkeleton data-testid={BREADCRUMB_ITEM_TEST_IDS.OKMS_SKELETON} className="w-9" />
      </div>
    );

  return (
    <OdsBreadcrumbItem
      data-testid={BREADCRUMB_ITEM_TEST_IDS.OKMS}
      key={okmsId}
      label={error ? okmsId : okms?.iam?.displayName || okmsId}
      href={link}
    />
  );
};

export const OkmsBreadcrumbItem = () => {
  const { okmsId } = useRequiredParams('okmsId');

  return <Item okmsId={okmsId} />;
};
