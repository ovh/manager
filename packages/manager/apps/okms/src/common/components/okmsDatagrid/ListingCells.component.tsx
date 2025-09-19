import React from 'react';
import {
  Clipboard,
  DataGridTextCell,
  Region,
  useServiceDetails,
} from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { OKMS } from '@/types/okms.type';
import { OkmsServiceState } from '@/components/layout-helpers/Dashboard/okmsServiceState/OkmsServiceState.component';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';
import { OkmsDatagridType } from './okmsDatagrid.type';
import { Link } from '@/common/components/Link/Link.component';

export const DatagridCellId = (okms: OKMS) => {
  return <Clipboard className="w-full" value={okms.id} />;
};

export const DatagridCellName = (
  okms: OKMS,
  type: OkmsDatagridType = 'kms',
) => {
  const { trackClick } = useOvhTracking();

  const urls: Record<OkmsDatagridType, string> = {
    kms: KMS_ROUTES_URLS.kmsDashboard(okms.id),
    'secret-manager': SECRET_MANAGER_ROUTES_URLS.secretListing(okms.id),
  };
  const tracking: Record<OkmsDatagridType, string> = {
    kms: 'go-to-kms',
    'secret-manager': '',
  };

  return (
    <Link
      href={urls[type]}
      label={okms.iam.displayName}
      isRouterLink
      onClick={() => {
        if (tracking[type].length > 0) {
          trackClick({
            location: PageLocation.datagrid,
            buttonType: ButtonType.link,
            actionType: 'navigation',
            actions: [tracking[type]],
          });
        }
      }}
    />
  );
};

export const DatagridCellRegion = (okms: OKMS) => {
  return (
    <DataGridTextCell>
      <Region
        mode="region"
        name={okms.region.toLowerCase().replaceAll('_', '-')}
      />
    </DataGridTextCell>
  );
};

export const DatagridCellStatus = (okms: OKMS) => {
  const { data: OkmsServiceInfos, isLoading, isError } = useServiceDetails({
    resourceName: okms.id,
  });
  if (isLoading) {
    return <OdsSpinner size={ODS_SPINNER_SIZE.sm} />;
  }
  if (isError) {
    return <></>;
  }
  return <OkmsServiceState state={OkmsServiceInfos.data.resource.state} />;
};

export const DatagridCellKmipCount = (okms: OKMS) => {
  return <DataGridTextCell>{okms.kmipObjectCount}</DataGridTextCell>;
};

export const DatagridCellServiceKeyCount = (okms: OKMS) => {
  return <DataGridTextCell>{okms.serviceKeyCount}</DataGridTextCell>;
};

export const DatagridCellSecretCount = (okms: OKMS) => {
  return <DataGridTextCell>{okms.secretCount}</DataGridTextCell>;
};
