import React, { useContext, useEffect, useState } from 'react';
import {
  DataGridClipboardCell,
  DataGridTextCell,
  Links,
} from '@ovhcloud/manager-components';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_COLOR_INTENT } from '@ovhcloud/ods-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { parseISO } from 'date-fns';
import { OKMS } from '@/types/okms.type';
import KmsActionMenu from '../menu/KmsActionMenu.component';
import { OkmsServiceKey } from '@/types/okmsServiceKey.type';

export const DatagridCellId = (props: OKMS | OkmsServiceKey) => {
  return <DataGridClipboardCell text={props.id} />;
};

export const DatagridCellName = (props: OKMS) => {
  const navigate = useNavigate();

  return (
    <div>
      <Links
        onClickReturn={() => {
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

export const DatagridActionMenu = (props: OKMS) => {
  return <KmsActionMenu {...props} />;
};

export const DatagridServiceKeyCellName = (props: OkmsServiceKey) => {
  const navigate = useNavigate();
  return (
    <div>
      <Links
        onClickReturn={() => {
          navigate(`/${props?.id}`);
        }}
        label={props?.name}
      />
    </div>
  );
};

export const DatagridServiceKeyCellId = (props: OkmsServiceKey) => {
  return <DataGridClipboardCell text={props.id} />;
};

export const DatagridCellType = (props: OkmsServiceKey) => {
  return <DataGridTextCell> {props.type}</DataGridTextCell>;
};

export const DatagridCreationDate = (props: OkmsServiceKey) => {
  const { environment } = useContext(ShellContext);
  const [dateTimeFormat, setDateTimeFormat] = useState<Intl.DateTimeFormat>();

  useEffect(() => {
    setDateTimeFormat(
      new Intl.DateTimeFormat(environment.getUserLocale().replace('_', '-'), {
        hour12: false,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }),
    );
  }, [environment]);

  return (
    <DataGridTextCell>
      {dateTimeFormat?.format(parseISO(props.createdAt))}
    </DataGridTextCell>
  );
};

export const DatagridStatus = (props: OkmsServiceKey) => {
  return (
    <OsdsChip color={ODS_TEXT_COLOR_INTENT.success}>{props.state}</OsdsChip>
  );
};

export const DatagridServiceKeyActionMenu = (props: OkmsServiceKey) => {
  return <></>;
};
