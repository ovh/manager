import React from 'react';
import {
  DataGridClipboardCell,
  DataGridTextCell,
} from '@ovhcloud/manager-components';
import { OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_COLOR_INTENT } from '@ovhcloud/ods-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OKMS } from '@/interface';
import KmsActionMenu from '../menu/KmsActionMenu.component';

export const DatagridCellName = (props: OKMS) => {
  const navigate = useNavigate();
  return (
    <div>
      <OsdsLink
        onClick={() => {
          navigate(`/${props?.id}`);
        }}
        color={ODS_TEXT_COLOR_INTENT.primary}
      >
        {props?.iam.displayName}
      </OsdsLink>
    </div>
  );
};

export const DatagridCellId = (props: OKMS) => {
  return <DataGridClipboardCell text={props.id} />;
};

export const DatagridCellRegion = (props: OKMS) => {
  const { t } = useTranslation('key-management-service/listing');
  return (
    <DataGridTextCell>
      {t(`key_management_service_listing_region_${props.region.toLowerCase()}`)}
    </DataGridTextCell>
  );
};

export const DatagridCellRestApiEndpoint = (props: OKMS) => {
  return <OsdsLink href={props?.restEndpoint}>{props?.restEndpoint}</OsdsLink>;
};

export const DatagridActionMenu = (props: OKMS) => {
  return <KmsActionMenu {...props} />;
};
