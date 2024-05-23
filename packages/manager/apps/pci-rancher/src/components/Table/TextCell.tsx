import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { Cell } from '@tanstack/react-table';
import { RancherService } from '@/api/api.type';
import './Table.scss';
import { AllPossibleKeys, useTranslate } from '@/utils/translation';

interface DisplayCellInterface {
  cell: Cell<RancherService, unknown>;
}

function DisplayCellText({ cell }: Readonly<DisplayCellInterface>) {
  const { t } = useTranslate('pci-rancher/listing');
  const label = cell.renderValue() as string;
  return (
    <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
      {label ? t(label as AllPossibleKeys) : '-'}
    </OsdsText>
  );
}

export default DisplayCellText;
