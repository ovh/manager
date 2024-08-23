import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { Cell } from '@tanstack/react-table';
import { RancherService } from '@/types/api.type';
import '../Table.scss';

interface DisplayCellInterface {
  cell: Cell<RancherService, unknown>;
}

function DisplayCellText({ cell }: Readonly<DisplayCellInterface>) {
  const { t } = useTranslation('listing');
  const label = cell.renderValue() as string;
  return (
    <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
      {label ? t(label as string) : '-'}
    </OsdsText>
  );
}

export default DisplayCellText;
