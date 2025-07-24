import React from 'react';
import {
  ActionMenu,
  Clipboard,
  DataGridTextCell,
  Links,
} from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OkmsAllServiceKeys } from '@/types/okmsServiceKey.type';
import { useServiceKeyTypeTranslations } from '@/hooks/serviceKey/useServiceKeyTypeTranslations';
import { ServiceKeyStatus } from '../serviceKey/serviceKeyStatus/serviceKeyStatus.component';
import useServiceKeyActionsList from '@/hooks/serviceKey/useServiceKeyActionsList';
import { useFormattedDate } from '@/hooks/useFormattedDate';
import { OKMS } from '@/types/okms.type';

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

export const DatagridServiceKeyActionMenu = (
  serviceKey: OkmsAllServiceKeys,
  okms: OKMS,
) => {
  const actionList = useServiceKeyActionsList(okms, serviceKey, true);
  return (
    <ActionMenu
      id={`service-key-actions-${serviceKey.id}`}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
      icon={ODS_ICON_NAME.ellipsisVertical}
      items={actionList}
    />
  );
};
