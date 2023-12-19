import React from 'react';
import { OsdsChip, OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components/';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { RessourceStatus } from '@/api/api.type';
import { RancherCellData } from './Table.type';
import './Table.scss';

export default function ProductStatusCell({ cell }: Readonly<RancherCellData>) {
  const label: RessourceStatus = cell.renderValue();
  const { t } = useTranslation('pci-rancher/listing');
  const colorByProductStatus: {
    [key in RessourceStatus]: ODS_THEME_COLOR_INTENT;
  } = {
    [RessourceStatus.READY]: ODS_THEME_COLOR_INTENT.success,
    [RessourceStatus.DISABLED]: ODS_THEME_COLOR_INTENT.error,
    [RessourceStatus.UPDATING]: ODS_THEME_COLOR_INTENT.info,
    [RessourceStatus.ERROR]: ODS_THEME_COLOR_INTENT.error,
    [RessourceStatus.CREATING]: ODS_THEME_COLOR_INTENT.info,
    [RessourceStatus.DELETING]: ODS_THEME_COLOR_INTENT.info,
  };

  return label ? (
    <OsdsChip inline color={colorByProductStatus[label]}>
      {t(label)}
    </OsdsChip>
  ) : (
    <OsdsSpinner inline size={ODS_SPINNER_SIZE.sm} />
  );
}
