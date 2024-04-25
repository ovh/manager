import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner, OsdsChip } from '@ovhcloud/ods-components/react';
import { ProductStatus } from '@/api';

const colorByProductStatus = {
  [ProductStatus.ACTIVE]: ODS_THEME_COLOR_INTENT.success,
  [ProductStatus.DISABLED]: ODS_THEME_COLOR_INTENT.error,
  [ProductStatus.DRAFT]: ODS_THEME_COLOR_INTENT.info,
};

export const ProductStatusChip: React.FC<{ productStatus: ProductStatus }> = ({
  productStatus,
}) => {
  const { t } = useTranslation('vrack-services/listing');
  return productStatus ? (
    <OsdsChip inline color={colorByProductStatus[productStatus]}>
      {t(productStatus)}
    </OsdsChip>
  ) : (
    <OsdsSpinner inline size={ODS_SPINNER_SIZE.sm} />
  );
};
