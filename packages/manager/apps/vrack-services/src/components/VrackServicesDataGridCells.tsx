import React from 'react';
import { TFunction } from 'react-i18next';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { NavigateFunction } from 'react-router-dom';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsSpinner,
  OsdsIcon,
  OsdsLink,
  OsdsButton,
  OsdsChip,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { TrackingProps } from '@ovh-ux/manager-react-shell-client';
import { EditableText } from '@/components/EditableText';
import { ProductStatus, UpdateVrackServicesParams, VrackServices } from '@/api';
import { DataGridCellProps, handleClick } from '@/utils/ods-utils';
import { isEditable } from '@/utils/vs-utils';

export const DisplayNameCell: React.FC<DataGridCellProps<
  string | undefined,
  VrackServices
> & {
  updateVS: UseMutateAsyncFunction<
    ApiResponse<VrackServices>,
    ApiError,
    UpdateVrackServicesParams
  >;
  navigate?: NavigateFunction;
  trackClick: (prop: TrackingProps) => PromiseLike<void>;
}> = ({ cellData, rowData, updateVS, navigate, trackClick }) => {
  const displayName = cellData || rowData?.id;
  return (
    <EditableText
      disabled={!isEditable(rowData)}
      defaultValue={cellData}
      dataTrackingPath="overview"
      editDataTracking="::edit"
      confirmDataTracking="::update::confirm"
      trackClick={trackClick}
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
    [ProductStatus.ACTIVE]: ODS_THEME_COLOR_INTENT.success,
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

export const RegionCell: React.FC<DataGridCellProps<string> & {
  t: TFunction;
}> = ({ cellData, t }) => (
  <OsdsText color={ODS_THEME_COLOR_INTENT.text}>{t(cellData)}</OsdsText>
);

export const CreatedAtCell: React.FC<DataGridCellProps<string | null> & {
  locale: string;
}> = ({ cellData, locale }) => {
  const date = new Date(cellData);
  return (
    <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
      {date.toString() !== 'Invalid Date'
        ? date.toLocaleDateString(locale)
        : '-'}
    </OsdsText>
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
    return href ? (
      <OsdsLink href={href}>{cellData}</OsdsLink>
    ) : (
      <OsdsText color={ODS_THEME_COLOR_INTENT.text}>{cellData}</OsdsText>
    );
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
  openModal: (id: string) => void;
}> = ({ rowData, isLoading, openModal }) => {
  const editable = isEditable(rowData);

  /* TODO: Maybe switch to "reactivate button" if the vRack Services is disabled */
  return (
    <OsdsButton
      inline
      circle
      color={ODS_THEME_COLOR_INTENT.error}
      variant={ODS_BUTTON_VARIANT.ghost}
      type={ODS_BUTTON_TYPE.button}
      size={ODS_BUTTON_SIZE.sm}
      disabled={isLoading || !editable || undefined}
      {...handleClick(() => openModal(rowData.id))}
    >
      <OsdsIcon
        color={ODS_THEME_COLOR_INTENT.error}
        name={ODS_ICON_NAME.TRASH}
        size={ODS_ICON_SIZE.xs}
      />
    </OsdsButton>
  );
};
