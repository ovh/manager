import React from 'react';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components/button';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import { OsdsIcon } from '@ovhcloud/ods-components/icon/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import { OsdsClipboard } from '@ovhcloud/ods-components/clipboard/react';
import { EditableText } from '@/components/EditableText';
import {
  ResponseData,
  Subnet,
  UpdateVrackServicesParams,
  VrackServices,
} from '@/api';
import { DataGridCellProps, handleClick } from '@/utils/ods-utils';
import { isEditable } from '@/utils/vs-utils';

type UpdateVS = UseMutateAsyncFunction<
  ResponseData<VrackServices>,
  ResponseData<Error>,
  UpdateVrackServicesParams
>;

export const DisplayNameCell: React.FC<DataGridCellProps<
  string | undefined,
  Subnet
> & {
  vrackServices?: VrackServices;
  updateVS: UpdateVS;
}> = ({ cellData, rowData, updateVS, vrackServices }) => (
  <EditableText
    disabled={!isEditable(vrackServices)}
    defaultValue={cellData}
    onEditSubmitted={async (value) => {
      await updateVS({
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
      });
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
    {...handleClick(() => openDeleteModal(rowData.cidr))}
  >
    <OsdsIcon
      color={ODS_THEME_COLOR_INTENT.error}
      name={ODS_ICON_NAME.TRASH}
      size={ODS_ICON_SIZE.xs}
    />
  </OsdsButton>
);
