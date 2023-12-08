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
import { OsdsSpinner } from '@ovhcloud/ods-components/spinner/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components/spinner';
import { EditableText } from '@/components/EditableText';
import {
  ProductStatus,
  ResponseData,
  UpdateVrackServicesParams,
  VrackServices,
} from '@/api';
import { DataGridCellProps, handleClick } from '@/utils/ods-utils';
import { ApiError } from '@/components/Error';
import { isEditable } from '@/utils/vs-utils';

export const DisplayNameCell: React.FC<DataGridCellProps<
  string | undefined,
  VrackServices
> & {
  updateVS: UseMutateAsyncFunction<
    ResponseData<VrackServices>,
    ResponseData<ApiError>,
    UpdateVrackServicesParams
  >;
  navigate?: NavigateFunction;
}> = ({ cellData, rowData, updateVS, navigate }) => {
  const displayName = cellData || rowData?.id;
  return (
    <EditableText
      disabled={!isEditable(rowData)}
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
      {navigate ? (
        <OsdsLink
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => navigate(`/${rowData.id}`)}
        >
          {displayName}
        </OsdsLink>
      ) : (
        displayName
      )}
    </EditableText>
  );
};

export const ProductStatusCell: React.FC<DataGridCellProps<
  ProductStatus,
  VrackServices
> & { t: TFunction }> = ({ cellData, t }) => {
  const colorByProductStatus = {
    [ProductStatus.ACTIVE]: ODS_THEME_COLOR_INTENT.primary,
    [ProductStatus.DISABLED]: ODS_THEME_COLOR_INTENT.error,
    [ProductStatus.DRAFT]: ODS_THEME_COLOR_INTENT.info,
  };

  return cellData ? (
    <OsdsChip inline color={colorByProductStatus[cellData]}>
      {t(cellData)}
    </OsdsChip>
  ) : (
    <OsdsSpinner inline size={ODS_SPINNER_SIZE.sm} />
  );
};

export const VrackIdCell: React.FC<DataGridCellProps<
  string | null,
  VrackServices
> & {
  isLoading?: boolean;
  openAssociationModal: (id: string) => void;
  label: string;
  href?: string;
}> = ({ cellData, rowData, isLoading, openAssociationModal, label, href }) => {
  const editable = isEditable(rowData);

  if (cellData) {
    return href ? <OsdsLink href={href}>{cellData}</OsdsLink> : <>{cellData}</>;
  }

  return (
    <OsdsButton
      inline
      color={ODS_THEME_COLOR_INTENT.primary}
      variant={ODS_BUTTON_VARIANT.stroked}
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
  const editable = isEditable(rowData);

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
