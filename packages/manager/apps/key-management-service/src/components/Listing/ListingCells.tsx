import React, { useContext } from 'react';
import {
  ActionMenu,
  Clipboard,
  DataGridTextCell,
  Links,
  useServiceDetails,
} from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ODS_ICON_NAME, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { OKMS } from '@/types/okms.type';
import KmsActionMenu from '../menu/KmsActionMenu.component';
import { OkmsAllServiceKeys } from '@/types/okmsServiceKey.type';
import { useServiceKeyTypeTranslations } from '@/hooks/serviceKey/useServiceKeyTypeTranslations';
import { ServiceKeyStatus } from '../serviceKey/serviceKeyStatus/serviceKeyStatus.component';
import useServiceKeyActionsList from '@/hooks/serviceKey/useServiceKeyActionsList';
import { useOkmsServiceKeyById } from '@/data/hooks/useOkmsServiceKeys';
import { useFormattedDate } from '@/hooks/useFormattedDate';
import { OkmsServiceState } from '../layout-helpers/Dashboard/okmsServiceState/OkmsServiceState.component';
import { OkmsContext } from '@/pages/dashboard';

export const DatagridCellId = (props: OKMS | OkmsAllServiceKeys) => {
  return <Clipboard value={props.id} />;
};

export const DatagridCellName = (props: OKMS) => {
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();

  return (
    <div>
      <Links
        onClickReturn={() => {
          trackClick({
            location: PageLocation.datagrid,
            buttonType: ButtonType.link,
            actionType: 'navigation',
            actions: ['go-to-kms'],
          });
          navigate(`/${props?.id}`);
        }}
        label={props?.iam.displayName}
      />
    </div>
  );
};

export const DatagridCellRegion = (props: OKMS) => {
  const { t } = useTranslation('key-management-service/listing');
  return (
    <DataGridTextCell>
      {t(`key_management_service_listing_region_${props.region.toLowerCase()}`)}
    </DataGridTextCell>
  );
};

export const DatagridCellStatus = (kms: OKMS) => {
  const { data: OkmsServiceInfos, isLoading, isError } = useServiceDetails({
    resourceName: kms.id,
  });
  if (isLoading) {
    return <OsdsSpinner inline size={ODS_SPINNER_SIZE.sm} />;
  }
  if (isError) {
    return <></>;
  }
  return (
    <OkmsServiceState
      state={OkmsServiceInfos.data.resource.state}
      inline={true}
    ></OkmsServiceState>
  );
};

export const DatagridActionMenu = (props: OKMS) => {
  return <KmsActionMenu {...props} />;
};

export const DatagridServiceKeyCellName = (props: OkmsAllServiceKeys) => {
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  return (
    <div>
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
      />
    </div>
  );
};

export const DatagridServiceKeyCellId = (props: OkmsAllServiceKeys) => {
  return <Clipboard value={props.id} />;
};

export const DatagridCellType = (props: OkmsAllServiceKeys) => {
  const translatedValue = useServiceKeyTypeTranslations(props.type);
  return <DataGridTextCell> {translatedValue}</DataGridTextCell>;
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
  return <ServiceKeyStatus state={props.state} inline />;
};

export const DatagridServiceKeyActionMenu = (props: OkmsAllServiceKeys) => {
  const okms = useContext(OkmsContext);
  const { data: serviceKey, isPending } = useOkmsServiceKeyById({
    okmsId: okms.id,
    keyId: props.id,
  });
  const actionList = useServiceKeyActionsList(okms, serviceKey?.data, true);

  if (isPending) {
    return <></>;
  }

  return (
    <ActionMenu
      items={actionList}
      isCompact
      icon={ODS_ICON_NAME.ELLIPSIS_VERTICAL}
    />
  );
};
