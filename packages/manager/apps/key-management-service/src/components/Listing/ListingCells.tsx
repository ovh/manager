import React from 'react';
import {
  DataGridClipboardCell,
  DataGridTextCell,
} from '@ovhcloud/manager-components';
import { useTranslation } from 'react-i18next';
import { OKMS } from '@/interface';

export const DatagridCellName = (props: OKMS) => {
  return <DataGridTextCell>{props.iam.displayName}</DataGridTextCell>;
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
