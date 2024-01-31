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
  trackEvent: (data: any) => Promise<void>;
}> = ({ cellData, rowData, updateVS, vrackServices, trackEvent }) => (
  <EditableText
    disabled={!isEditable(vrackServices)}
    defaultValue={cellData}
    dataTracking="vrack-services::subnets::edit-subnet"
    confirmDataTracking="vrack-services::subnets::update::confirm"
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
            trackEvent({
              name: 'vrack-services::subnets::update-success',
              level2: '0',
            });
          },
          onError: () => {
            trackEvent({
              name: 'vrack-services::subnets::update-error',
              level2: '0',
            });
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
}> = ({ vrackServices, rowData, isLoading, openDeleteModal }) => (
  <OsdsButton
    inline
    circle
    color={ODS_THEME_COLOR_INTENT.error}
    variant={ODS_BUTTON_VARIANT.ghost}
    type={ODS_BUTTON_TYPE.button}
    size={ODS_BUTTON_SIZE.sm}
    disabled={isLoading || !isEditable(vrackServices) || undefined}
    data-tracking="vrack-services::subnets::delete-subnet"
    {...handleClick(() => openDeleteModal(rowData.cidr))}
  >
    <OsdsIcon
      color={ODS_THEME_COLOR_INTENT.error}
      name={ODS_ICON_NAME.TRASH}
      size={ODS_ICON_SIZE.xs}
    />
  </OsdsButton>
);
