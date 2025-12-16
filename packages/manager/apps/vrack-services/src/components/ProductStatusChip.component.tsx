import React from 'react';
import { useTranslation } from 'react-i18next';
import { BADGE_COLOR, SPINNER_SIZE, Spinner, Badge } from '@ovhcloud/ods-react';
import { VrackServicesProductStatus } from '@ovh-ux/manager-network-common';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

const colorByProductStatus = {
  [VrackServicesProductStatus.ACTIVE]: BADGE_COLOR.success,
  [VrackServicesProductStatus.SUSPENDED]: BADGE_COLOR.neutral,
  [VrackServicesProductStatus.DRAFT]: BADGE_COLOR.information,
};

export type ProductStatusChipProps = {
  productStatus: VrackServicesProductStatus;
};

export const ProductStatusChip: React.FC<ProductStatusChipProps> = ({
  productStatus,
}) => {
  const { t } = useTranslation(NAMESPACES.SERVICE);
  return productStatus ? (
    <Badge color={colorByProductStatus[productStatus]}>
      {t(`service_state_${productStatus?.toLowerCase()}`)}
    </Badge>
  ) : (
    <Spinner size={SPINNER_SIZE.sm} data-testid="status-chip-spinner" />
  );
};
