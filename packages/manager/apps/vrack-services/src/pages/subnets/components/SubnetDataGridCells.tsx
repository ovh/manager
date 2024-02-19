import React from 'react';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsClipboard,
  OsdsIcon,
  OsdsButton,
} from '@ovhcloud/ods-components/react';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { TrackingProps } from '@ovh-ux/manager-react-shell-client';
import { EditableText } from '@/components/EditableText';
import { Subnet, UpdateVrackServicesParams, VrackServices } from '@/api';
import { DataGridCellProps, handleClick } from '@/utils/ods-utils';
import { isEditable } from '@/utils/vs-utils';

type UpdateVS = UseMutateAsyncFunction<
  ApiResponse<VrackServices>,
  ApiError,
  UpdateVrackServicesParams
>;

export const DisplayNameCell: React.FC<DataGridCellProps<
  string | undefined,
  Subnet
> & {
  vrackServices?: VrackServices;
  updateVS: UpdateVS;
  trackEvent: (data: TrackingProps) => PromiseLike<void>;
  trackClick: (prop: TrackingProps) => PromiseLike<void>;
}> = ({
  cellData,
  rowData,
  updateVS,
  vrackServices,
  trackEvent,
  trackClick,
}) => (
  <EditableText
    disabled={!isEditable(vrackServices)}
    defaultValue={cellData}
    dataTrackingPath="subnets"
    editDataTracking="::edit-subnet"
    confirmDataTracking="::update::confirm"
    trackClick={trackClick}
    onEditSubmitted={async (value) => {
      await updateVS(
        {
          vrackServicesId: vrackServices.id,
          checksum: vrackServices.checksum,
          targetSpec: {
            displayName: vrackServices.currentState.displayName || null,
            subnets: vrackServices.currentState.subnets.map((subnet) =>
              subnet.cidr === rowData.cidr
                ? {
                    ...subnet,
                    displayName: value,
                  }
                : subnet,
            ),
          },
        },
        {
          onSuccess: () => {
            trackEvent({ path: 'subnets::update', value: '-success' });
          },
          onError: () => {
            trackEvent({ path: 'subnets::update', value: '-error' });
          },
        },
      );
    }}
  >
    {cellData}
  </EditableText>
);

export const CidrCell: React.FC<DataGridCellProps<
  string | undefined,
  Subnet
>> = ({ cellData }) => <OsdsClipboard value={cellData} inline />;

export const ActionsCell: React.FC<DataGridCellProps<undefined, Subnet> & {
  isLoading?: boolean;
  vrackServices?: VrackServices;
  openDeleteModal: (cidr: string) => void;
  trackClick: (data: TrackingProps) => PromiseLike<void>;
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
      trackClick({ path: 'subnets', value: '::delete-subnet', type: 'action' });
      openDeleteModal(rowData.cidr);
    })}
  >
    <OsdsIcon
      color={ODS_THEME_COLOR_INTENT.error}
      name={ODS_ICON_NAME.TRASH}
      size={ODS_ICON_SIZE.xs}
    />
  </OsdsButton>
);
