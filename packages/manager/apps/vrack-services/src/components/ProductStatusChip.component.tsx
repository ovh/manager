import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner, OsdsChip } from '@ovhcloud/ods-components/react';
import { VrackServicesProductStatus } from '@ovh-ux/manager-network-common';

const colorByProductStatus = {
  [VrackServicesProductStatus.ACTIVE]: ODS_THEME_COLOR_INTENT.success,
  [VrackServicesProductStatus.SUSPENDED]: ODS_THEME_COLOR_INTENT.default,
  [VrackServicesProductStatus.DRAFT]: ODS_THEME_COLOR_INTENT.info,
};

export type ProductStatusChipProps = {
  productStatus: VrackServicesProductStatus;
};

export const ProductStatusChip: React.FC<ProductStatusChipProps> = ({
  productStatus,
}) => {
  const { t } = useTranslation('vrack-services/listing');
  return productStatus ? (
    <OsdsChip inline color={colorByProductStatus[productStatus]}>
      {t(productStatus)}
    </OsdsChip>
  ) : (
    <OsdsSpinner
      inline
      size={ODS_SPINNER_SIZE.sm}
      data-testid="status-chip-spinner"
    />
  );
};
