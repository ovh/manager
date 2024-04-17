import React from 'react';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsClipboard,
  OsdsIcon,
  OsdsButton,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { EditableText } from '@/components/EditableText';
import { Subnet, UpdateVrackServicesParams, VrackServices } from '@/api';
import { DataGridCellProps, handleClick } from '@/utils/ods-utils';
import { isEditable } from '@/utils/vs-utils';
import { PageName } from '@/utils/tracking';

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
  trackPage: (data: unknown) => void;
  emptyValueLabel: string;
}> = ({
  cellData,
  rowData,
  updateVS,
  vrackServices,
  trackPage,
  emptyValueLabel,
}) => (
  <EditableText
    disabled={!isEditable(vrackServices)}
    defaultValue={cellData}
    emptyValueLabel={emptyValueLabel}
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
            trackPage({
              pageType: PageType.bannerInfo,
              pageName: PageName.pendingUpdateSubnet,
            });
          },
          onError: () => {
            trackPage({
              pageType: PageType.bannerError,
              pageName: PageName.errorUpdateSubnet,
            });
          },
        },
      );
    }}
  >
    {cellData}
  </EditableText>
);

export const TextCell: React.FC<DataGridCellProps<string> & {
  emptyValueLabel?: string;
}> = ({ cellData, emptyValueLabel }) => (
  <OsdsText
    color={ODS_THEME_COLOR_INTENT.text}
    level={ODS_TEXT_LEVEL.body}
    size={cellData ? ODS_TEXT_SIZE._800 : ODS_TEXT_SIZE._300}
  >
    {cellData ?? emptyValueLabel}
  </OsdsText>
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
