import React, { useContext } from 'react';
import {
  DataGridClipboardCell,
  DataGridTextCell,
  Links,
} from '@ovhcloud/manager-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OKMS } from '@/types/okms.type';
import KmsActionMenu from '../menu/KmsActionMenu.component';
import { OkmsAllServiceKeys } from '@/types/okmsServiceKey.type';
import { useServiceKeyTypeTranslations } from '@/hooks/serviceKey/useServiceKeyTypeTranslations';
import { ServiceKeyStatus } from '../serviceKey/serviceKeyStatus/serviceKeyStatus.component';
import { useFormattedDate } from '@/hooks/useFormattedDate';

export const DatagridCellId = (props: OKMS | OkmsAllServiceKeys) => {
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

export const DatagridServiceKeyCellName = (props: OkmsAllServiceKeys) => {
  const navigate = useNavigate();
  return (
    <div>
      <Links
        onClickReturn={() => {
          navigate(`${props?.id}`);
        }}
        label={props?.name}
      />
    </div>
  );
};

export const DatagridServiceKeyCellId = (props: OkmsAllServiceKeys) => {
  return <DataGridClipboardCell text={props.id} />;
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
  return <></>;
};
