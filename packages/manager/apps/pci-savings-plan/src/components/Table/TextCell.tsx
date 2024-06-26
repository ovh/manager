import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { Cell } from '@tanstack/react-table';
import { SavingsPlanService } from '@/data/api/api.type';
import './Table.scss';

interface DisplayCellInterface {
  cell: Cell<SavingsPlanService, unknown>;
}

function DisplayCellText({ cell }: Readonly<DisplayCellInterface>) {
  const { t } = useTranslation('pci-savingsPlan/listing');
  const label = cell.renderValue() as string;
  return (
    <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
      {label ? t(label as string) : '-'}
    </OsdsText>
  );
}

export default DisplayCellText;
