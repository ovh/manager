import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { Cell } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { RancherService } from '@/api/api.type';
import './Table.scss';

interface DisplayCellInterface {
  cell: Cell<RancherService, unknown>;
}

function DisplayCellText({ cell }: Readonly<DisplayCellInterface>) {
  const { t } = useTranslation('pci-rancher/listing');
  const label = cell.renderValue() as string;
  return (
    <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
      {label ? t(label) : '-'}
    </OsdsText>
  );
}

export default DisplayCellText;
