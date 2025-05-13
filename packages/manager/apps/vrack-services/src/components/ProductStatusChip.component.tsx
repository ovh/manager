import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_BADGE_COLOR, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OdsSpinner, OdsBadge } from '@ovhcloud/ods-components/react';
import { VrackServicesProductStatus } from '@ovh-ux/manager-network-common';

const colorByProductStatus = {
  [VrackServicesProductStatus.ACTIVE]: ODS_BADGE_COLOR.success,
  [VrackServicesProductStatus.SUSPENDED]: ODS_BADGE_COLOR.neutral,
  [VrackServicesProductStatus.DRAFT]: ODS_BADGE_COLOR.information,
};

export type ProductStatusChipProps = {
  productStatus: VrackServicesProductStatus;
};

export const ProductStatusChip: React.FC<ProductStatusChipProps> = ({
  productStatus,
}) => {
  const { t } = useTranslation('vrack-services/listing');
  return productStatus ? (
    <OdsBadge
      color={colorByProductStatus[productStatus]}
      label={t(productStatus)}
    />
  ) : (
    <OdsSpinner size={ODS_SPINNER_SIZE.sm} data-testid="status-chip-spinner" />
  );
};
