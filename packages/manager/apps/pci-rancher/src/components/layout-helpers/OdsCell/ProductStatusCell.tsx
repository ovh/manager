import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsChip } from '@ovhcloud/ods-components/chip/react';
import { OsdsSpinner } from '@ovhcloud/ods-components/spinner/react';
import React from 'react';
import { TFunction } from 'react-i18next';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components/spinner';
import { RancherService, RessourceStatus } from '@/api/api.type';

export type DataGridCellProps<Cell = string, Row = any> = {
  cellData?: Cell;
  rowData?: Row;
};

export const ProductStatusCell: React.FC<
  DataGridCellProps<RessourceStatus, RancherService> & { t: TFunction }
> = ({ cellData, t }) => {
  const colorByProductStatus = {
    [RessourceStatus.READY]: ODS_THEME_COLOR_INTENT.success,
    [RessourceStatus.DISABLED]: ODS_THEME_COLOR_INTENT.error,
    [RessourceStatus.UPDATING]: ODS_THEME_COLOR_INTENT.info,
  };

  return cellData ? (
    <OsdsChip inline color={colorByProductStatus[cellData]}>
      {t(cellData)}
    </OsdsChip>
  ) : (
    <OsdsSpinner inline size={ODS_SPINNER_SIZE.sm} />
  );
};
