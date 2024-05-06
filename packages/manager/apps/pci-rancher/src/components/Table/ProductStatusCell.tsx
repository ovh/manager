import React from 'react';
import { OsdsChip, OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components/';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ResourceStatus } from '@/api/api.type';
import { RancherCellData } from './Table.type';
import './Table.scss';

export default function ProductStatusCell({ cell }: Readonly<RancherCellData>) {
  const label = cell.renderValue() as string;
  const { t } = useTranslation('pci-rancher/listing');
  const colorByProductStatus: {
    [key in ResourceStatus]: ODS_THEME_COLOR_INTENT;
  } = {
    [ResourceStatus.READY]: ODS_THEME_COLOR_INTENT.success,
    [ResourceStatus.DISABLED]: ODS_THEME_COLOR_INTENT.error,
    [ResourceStatus.UPDATING]: ODS_THEME_COLOR_INTENT.info,
    [ResourceStatus.ERROR]: ODS_THEME_COLOR_INTENT.error,
    [ResourceStatus.CREATING]: ODS_THEME_COLOR_INTENT.info,
    [ResourceStatus.DELETING]: ODS_THEME_COLOR_INTENT.info,
  };

  return label ? (
    <OsdsChip inline color={colorByProductStatus[label as ResourceStatus]}>
      {t(label)}
    </OsdsChip>
  ) : (
    <OsdsSpinner inline size={ODS_SPINNER_SIZE.sm} />
  );
}
