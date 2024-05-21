import { OsdsChip, OsdsSpinner } from '@ovhcloud/ods-components/react';
import React from 'react';
import { TFunction } from 'react-i18next';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ResourceStatus } from '@/api/api.type';

export type DataGridCellProps<Cell = string> = {
  cellData?: Cell;
};

export const ProductStatusCell: React.FC<DataGridCellProps<ResourceStatus> & {
  t: TFunction;
}> = ({ cellData, t }) => {
  const colorByProductStatus = {
    [ResourceStatus.READY]: ODS_THEME_COLOR_INTENT.success,
    [ResourceStatus.DISABLED]: ODS_THEME_COLOR_INTENT.error,
    [ResourceStatus.UPDATING]: ODS_THEME_COLOR_INTENT.info,
    [ResourceStatus.ERROR]: ODS_THEME_COLOR_INTENT.error,
    [ResourceStatus.CREATING]: ODS_THEME_COLOR_INTENT.info,
    [ResourceStatus.DELETING]: ODS_THEME_COLOR_INTENT.info,
  };

  return cellData ? (
    <OsdsChip inline color={colorByProductStatus[cellData]}>
      {t(cellData)}
    </OsdsChip>
  ) : (
    <OsdsSpinner inline size={ODS_SPINNER_SIZE.sm} />
  );
};
