import React from 'react';
import { TFunction } from 'react-i18next';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { OsdsLink } from '@ovhcloud/ods-components/link/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { NavigateFunction } from 'react-router-dom';
import { OsdsChip } from '@ovhcloud/ods-components/chip/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components/button';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import { OsdsIcon } from '@ovhcloud/ods-components/icon/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import { EditableText } from '@/components/EditableText';
import {
  ProductStatus,
  ResourceStatus,
  ResponseData,
  UpdateVrackServicesParams,
  VrackServices,
} from '@/api';
import { DataGridCellProps, handleClick } from '@/utils/ods-utils';
import { ApiError } from '@/components/Error';

const colorByProductStatus = {
  [ProductStatus.ACTIVE]: ODS_THEME_COLOR_INTENT.primary,
  [ProductStatus.DISABLED]: ODS_THEME_COLOR_INTENT.error,
  [ProductStatus.DRAFT]: ODS_THEME_COLOR_INTENT.info,
};

const isEditable = ({
  resourceStatus,
  productStatus,
}: {
  resourceStatus: ResourceStatus;
  productStatus: ProductStatus;
}) =>
  resourceStatus === ResourceStatus.READY &&
  [ProductStatus.ACTIVE, ProductStatus.DRAFT].includes(productStatus);

export const DisplayNameCell: React.FC<DataGridCellProps<
  string | undefined,
  VrackServices
> & {
  updateVS: UseMutateAsyncFunction<
    ResponseData<VrackServices>,
    ResponseData<ApiError>,
    UpdateVrackServicesParams
  >;
  navigate: NavigateFunction;
}> = ({ cellData, rowData, updateVS, navigate }) => (
  <EditableText
    disabled={
      !isEditable({
        productStatus: rowData?.currentState?.productStatus,
        resourceStatus: rowData?.resourceStatus,
      })
    }
    defaultValue={cellData}
    onEditSubmitted={async (value) => {
      await updateVS({
        vrackServicesId: rowData.id,
        checksum: rowData.checksum,
        targetSpec: {
          displayName: value || null,
          subnets: rowData.currentState.subnets || [],
        },
      });
    }}
  >
    <OsdsLink
      color={ODS_THEME_COLOR_INTENT.primary}
      onClick={() => navigate(`/${rowData.id}`)}
    >
      {cellData || rowData?.id}
    </OsdsLink>
  </EditableText>
);

export const ProductStatusCell: React.FC<DataGridCellProps<
  ProductStatus,
  VrackServices
> & { t: TFunction }> = ({ cellData, t }) => (
  <OsdsChip inline color={colorByProductStatus[cellData]}>
    {t(cellData)}
  </OsdsChip>
);

export const VrackIdCell: React.FC<DataGridCellProps<
  string | null,
  VrackServices
> & {
  isLoading?: boolean;
  openAssociationModal: (id: string) => void;
  label: string;
}> = ({ cellData, rowData, isLoading, openAssociationModal, label }) => {
  const editable = isEditable({
    productStatus: rowData?.currentState?.productStatus,
    resourceStatus: rowData?.resourceStatus,
  });

  return cellData ? (
    <>{cellData}</>
  ) : (
    <OsdsButton
      inline
      color={ODS_THEME_COLOR_INTENT.primary}
      variant={ODS_BUTTON_VARIANT.flat}
      type={ODS_BUTTON_TYPE.button}
      size={ODS_BUTTON_SIZE.sm}
      disabled={isLoading || !editable || undefined}
      {...handleClick(() => openAssociationModal(rowData.id))}
    >
      {label}
    </OsdsButton>
  );
};

export const ActionsCell: React.FC<DataGridCellProps<
  undefined,
  VrackServices
> & {
  isLoading?: boolean;
}> = ({ rowData, isLoading }) => {
  const editable = isEditable({
    productStatus: rowData?.currentState?.productStatus,
    resourceStatus: rowData?.resourceStatus,
  });

  /* TODO: Maybe switch to "reactivate button" if the vRack Services is disabled */
  return (
    <OsdsButton
      inline
      color={ODS_THEME_COLOR_INTENT.error}
      variant={ODS_BUTTON_VARIANT.stroked}
      type={ODS_BUTTON_TYPE.button}
      size={ODS_BUTTON_SIZE.sm}
      disabled={isLoading || !editable || undefined}
      {...handleClick(() => console.log('delete ', rowData.id))}
    >
      <OsdsIcon
        color={ODS_THEME_COLOR_INTENT.error}
        name={ODS_ICON_NAME.TRASH}
        size={ODS_ICON_SIZE.xs}
      />
    </OsdsButton>
  );
};
