import React, { useContext } from 'react';
import {
  ActionMenu,
  Clipboard,
  DataGridTextCell,
  Links,
  Region,
  useServiceDetails,
} from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { OKMS } from '@/types/okms.type';
import { OkmsAllServiceKeys } from '@/types/okmsServiceKey.type';
import { useServiceKeyTypeTranslations } from '@/hooks/serviceKey/useServiceKeyTypeTranslations';
import { ServiceKeyStatus } from '../serviceKey/serviceKeyStatus/serviceKeyStatus.component';
import useServiceKeyActionsList from '@/hooks/serviceKey/useServiceKeyActionsList';
import { useOkmsServiceKeyById } from '@/data/hooks/useOkmsServiceKeys';
import { useFormattedDate } from '@/hooks/useFormattedDate';
import { OkmsServiceState } from '../layout-helpers/Dashboard/okmsServiceState/OkmsServiceState.component';
import { OkmsContext } from '@/pages/dashboard';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';

export const DatagridCellId = (props: OKMS | OkmsAllServiceKeys) => {
  return <Clipboard className="w-full" value={props.id} />;
};

export const DatagridCellName = (props: OKMS) => {
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();

  return (
    <Links
      onClickReturn={() => {
        trackClick({
          location: PageLocation.datagrid,
          buttonType: ButtonType.link,
          actionType: 'navigation',
          actions: ['go-to-kms'],
        });
        navigate(KMS_ROUTES_URLS.kmsDashboard(props?.id));
      }}
      label={props?.iam.displayName}
    />
  );
};

export const DatagridCellRegion = (kms: OKMS) => {
  return (
    <DataGridTextCell>
      <Region
        mode="region"
        name={kms.region.toLowerCase().replaceAll('_', '-')}
      />
    </DataGridTextCell>
  );
};

export const DatagridCellStatus = (kms: OKMS) => {
  const { data: OkmsServiceInfos, isLoading, isError } = useServiceDetails({
    resourceName: kms.id,
  });
  if (isLoading) {
    return <OdsSpinner size={ODS_SPINNER_SIZE.sm} />;
  }
  if (isError) {
    return <></>;
  }
  return <OkmsServiceState state={OkmsServiceInfos.data.resource.state} />;
};

export const DatagridResourceKmipCountCell = (kms: OKMS) => {
  return <DataGridTextCell>{kms.kmipObjectCount}</DataGridTextCell>;
};

export const DatagridResourceServiceKeyCountCell = (kms: OKMS) => {
  return <DataGridTextCell>{kms.serviceKeyCount}</DataGridTextCell>;
};

export const DatagridServiceKeyCellName = (props: OkmsAllServiceKeys) => {
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  return (
    <Links
      onClickReturn={() => {
        trackClick({
          location: PageLocation.datagrid,
          buttonType: ButtonType.link,
          actionType: 'navigation',
          actions: ['details_encryption_key'],
        });
        navigate(`${props?.id}`);
      }}
      label={props?.name}
      data-testid={`service-key-link-${props.id}`}
    />
  );
};

export const DatagridServiceKeyCellId = (props: OkmsAllServiceKeys) => {
  return <Clipboard className="w-full" value={props.id} />;
};

export const DatagridCellType = (props: OkmsAllServiceKeys) => {
  const translatedValue = useServiceKeyTypeTranslations(props.type);
  return <DataGridTextCell>{translatedValue}</DataGridTextCell>;
};

export const DatagridCreationDate = (props: OkmsAllServiceKeys) => {
  const date = new Date(Date.parse(props.createdAt));

  const formattedDate = useFormattedDate({
    date,
    options: {
      hour12: false,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    },
  });

  return <DataGridTextCell>{formattedDate}</DataGridTextCell>;
};

export const DatagridStatus = (props: OkmsAllServiceKeys) => {
  return <ServiceKeyStatus state={props.state} />;
};

export const DatagridServiceKeyActionMenu = (props: OkmsAllServiceKeys) => {
  const okms = useContext(OkmsContext);
  const { data: serviceKey, isPending } = useOkmsServiceKeyById({
    okmsId: okms.id,
    keyId: props.id,
  });
  const actionList = useServiceKeyActionsList(okms, serviceKey?.data, true);

  return (
    <ActionMenu
      id={`service-key-actions-${props.id}`}
      isLoading={isPending}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
      icon={ODS_ICON_NAME.ellipsisVertical}
      items={actionList}
    />
  );
};
