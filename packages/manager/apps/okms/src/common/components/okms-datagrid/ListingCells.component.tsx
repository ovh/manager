import { OkmsServiceState } from '@key-management-service/components/layout-helpers/dashboard/okms-service-state/OkmsServiceState.component';
import { useRegionName } from '@key-management-service/hooks/useRegionName';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { OKMS } from '@key-management-service/types/okms.type';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';

import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OdsSpinner } from '@ovhcloud/ods-components/react';

import { useServiceDetails } from '@ovh-ux/manager-module-common-api';
import { Clipboard, DataGridTextCell } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { Link } from '@/common/components/link/Link.component';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { TrackingTags } from '@/tracking.constant';

import { OKMS_LIST_CELL_TEST_IDS } from './ListingCells.constants';
import { OkmsDatagridType } from './okmsDatagrid.type';

export const DatagridCellId = (okms: OKMS) => {
  return (
    <Clipboard
      className="w-full"
      value={okms.id}
      data-testid={OKMS_LIST_CELL_TEST_IDS.id(okms.id)}
    />
  );
};

export const DatagridCellName = (okms: OKMS, type: OkmsDatagridType = 'kms') => {
  const { trackClick } = useOkmsTracking();

  const links: Record<OkmsDatagridType, { href: string; tracking: TrackingTags[] }> = {
    kms: {
      href: KMS_ROUTES_URLS.kmsDashboard(okms.id),
      tracking: ['okms'],
    },
    'secret-manager': {
      href: SECRET_MANAGER_ROUTES_URLS.secretList(okms.id),
      tracking: ['secret', 'list'],
    },
  };

  return (
    <Link
      href={links[type].href}
      label={okms.iam.displayName}
      isRouterLink
      data-testid={OKMS_LIST_CELL_TEST_IDS.name(okms.id)}
      onClick={() => {
        trackClick({
          location: PageLocation.datagrid,
          buttonType: ButtonType.link,
          actionType: 'navigation',
          actions: links[type].tracking,
        });
      }}
    />
  );
};

export const DatagridCellRegion = (okms: OKMS) => {
  const { translateRegionName } = useRegionName();
  return (
    <DataGridTextCell data-testid={OKMS_LIST_CELL_TEST_IDS.region(okms.id)}>
      {translateRegionName(okms.region)}
    </DataGridTextCell>
  );
};

export const DatagridCellStatus = (okms: OKMS) => {
  const {
    data: OkmsServiceInfos,
    isPending,
    isError,
  } = useServiceDetails({
    resourceName: okms.id,
  });
  if (isPending) {
    return <OdsSpinner size={ODS_SPINNER_SIZE.sm} />;
  }
  if (isError) {
    return <></>;
  }
  return (
    <OkmsServiceState
      state={OkmsServiceInfos.data.resource.state}
      data-testid={OKMS_LIST_CELL_TEST_IDS.status(okms.id)}
    />
  );
};

export const DatagridCellKmipCount = (okms: OKMS) => {
  return (
    <DataGridTextCell data-testid={OKMS_LIST_CELL_TEST_IDS.kmipCount(okms.id)}>
      {okms.kmipObjectCount}
    </DataGridTextCell>
  );
};

export const DatagridCellServiceKeyCount = (okms: OKMS) => {
  return (
    <DataGridTextCell data-testid={OKMS_LIST_CELL_TEST_IDS.serviceKeyCount(okms.id)}>
      {okms.serviceKeyCount}
    </DataGridTextCell>
  );
};

export const DatagridCellSecretCount = (okms: OKMS) => {
  return (
    <DataGridTextCell data-testid={OKMS_LIST_CELL_TEST_IDS.secretCount(okms.id)}>
      {okms.secretCount}
    </DataGridTextCell>
  );
};
