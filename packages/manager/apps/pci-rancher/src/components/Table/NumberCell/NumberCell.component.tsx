import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { Cell } from '@tanstack/react-table';
import { RancherService } from '@/types/api.type';
import '../Table.scss';

interface DisplayCellInterface {
  cell: Cell<RancherService, number>;
}

function DisplayCellNumber({ cell }: Readonly<DisplayCellInterface>) {
  const number = cell.renderValue();
  return <OsdsText color={ODS_THEME_COLOR_INTENT.text}>{number}</OsdsText>;
}

export default DisplayCellNumber;
