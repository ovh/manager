import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_INTENT,
} from '@ovhcloud/ods-components';
import { OsdsIcon, OsdsButton, OsdsText } from '@ovhcloud/ods-components/react';
import { TrackingProps } from '@ovh-ux/manager-react-shell-client';
import { Endpoint, VrackServices, IAMResource } from '@/api';
import { DataGridCellProps, handleClick } from '@/utils/ods-utils';
import { isEditable } from '@/utils/vs-utils';

export const ServiceName: React.FC<DataGridCellProps<string, Endpoint> & {
  iamResources?: IAMResource[];
}> = ({ cellData, iamResources }) => {
  const resource = iamResources?.find(
    (iamResource) => iamResource.urn === cellData,
  );
  return (
    <OsdsText color={ODS_TEXT_COLOR_INTENT.text}>
      {resource?.displayName || resource?.name || resource?.id}
    </OsdsText>
  );
};

export const ServiceType: React.FC<DataGridCellProps<string, Endpoint> & {
  iamResources?: IAMResource[];
}> = ({ iamResources, rowData }) => {
  const resource = iamResources?.find(
    (iamResource) => iamResource.urn === rowData.managedServiceURN,
  );
  return (
    <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
      {resource?.type || ''}
    </OsdsText>
  );
};

export const ActionsCell: React.FC<DataGridCellProps<undefined, Endpoint> & {
  isLoading?: boolean;
  vrackServices?: VrackServices;
  openDeleteModal: (managedServiceUrn: string) => void;
  trackClick: (props: TrackingProps) => PromiseLike<void>;
}> = ({ vrackServices, rowData, isLoading, openDeleteModal, trackClick }) => (
  <OsdsButton
    inline
    circle
    color={ODS_THEME_COLOR_INTENT.error}
    variant={ODS_BUTTON_VARIANT.ghost}
    type={ODS_BUTTON_TYPE.button}
    size={ODS_BUTTON_SIZE.sm}
    disabled={isLoading || !isEditable(vrackServices) || undefined}
    {...handleClick(() => {
      trackClick({
        path: 'endpoints',
        value: '::delete-endpoint',
        type: 'action',
      });
      openDeleteModal(rowData.managedServiceURN);
    })}
  >
    <OsdsIcon
      color={ODS_THEME_COLOR_INTENT.error}
      name={ODS_ICON_NAME.TRASH}
      size={ODS_ICON_SIZE.xs}
    />
  </OsdsButton>
);

export const TextCell: React.FC<DataGridCellProps<string>> = ({ cellData }) => (
  <OsdsText color={ODS_THEME_COLOR_INTENT.text}>{cellData ?? ''}</OsdsText>
);
