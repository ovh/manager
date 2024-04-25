/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  ovhLocaleToI18next,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  DataGridTextCell,
  Datagrid,
  DatagridColumn,
  useDataGrid,
} from '@ovhcloud/manager-components';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { DisplayName } from '@/components/display-name.component';
import { VrackId } from '@/components/vrack-id.component';
import { isEditable, useVrackServicesList } from '@/utils/vs-utils';
import { VrackServicesWithIAM } from '@/api';
import { ProductStatusChip } from '@/components/product-status.components';
import { urls } from '@/router/constants';
import { handleClick } from '@/utils/ods-utils';

export const VrackServicesDatagrid: React.FC = () => {
  const { t, i18n } = useTranslation('vrack-services/listing');

  const { data } = useVrackServicesList();
  const { sorting, setSorting } = useDataGrid({
    id: 'displayName',
    desc: false,
  });

  const columns: DatagridColumn<VrackServicesWithIAM>[] = [
    {
      id: 'currentState.displayName',
      label: t('displayName'),
      cell: (vs) => (
        <div className="px-3 flex justify-end min-w-[200px]">
          <DisplayName {...vs} hasLinkToDetails />
        </div>
      ),
    },
    {
      id: 'currentState.productStatus',
      label: t('productStatus'),
      cell: (vs) => (
        <ProductStatusChip productStatus={vs.currentState.productStatus} />
      ),
    },
    {
      id: 'currentState.region',
      label: t('region'),
      cell: (vs) => (
        <DataGridTextCell>{t(vs.currentState.region)}</DataGridTextCell>
      ),
    },
    {
      id: 'currentState.vrackId',
      label: t('vrackId'),
      cell: (vs) => <VrackId {...vs} />,
    },
    {
      id: 'createdAt',
      label: t('createdAt'),
      cell: (vs) => {
        const date = new Date(vs.createdAt);
        return (
          <DataGridTextCell>
            {date.toString() !== 'Invalid Date'
              ? date.toLocaleDateString(ovhLocaleToI18next(i18n.language))
              : '-'}
          </DataGridTextCell>
        );
      },
    },
    {
      id: 'actions',
      label: t('actions'),
      cell: (vs) => {
        const navigate = useNavigate();
        const { trackClick } = useOvhTracking();

        /* TODO: Maybe switch to "reactivate button" if the vRack Services is disabled */
        return (
          <OsdsButton
            inline
            circle
            color={ODS_THEME_COLOR_INTENT.error}
            variant={ODS_BUTTON_VARIANT.ghost}
            type={ODS_BUTTON_TYPE.button}
            size={ODS_BUTTON_SIZE.sm}
            disabled={!isEditable(vs) || undefined}
            {...handleClick(() => {
              trackClick({
                location: PageLocation.datagrid,
                buttonType: ButtonType.button,
                actionType: 'navigation',
                actions: ['delete_vrack-services'],
              });
              navigate(urls.listingDelete.replace(':id', vs.id));
            })}
          >
            <OsdsIcon
              color={ODS_THEME_COLOR_INTENT.error}
              name={ODS_ICON_NAME.TRASH}
              size={ODS_ICON_SIZE.xs}
            />
          </OsdsButton>
        );
      },
    },
  ];

  return (
    <>
      {/* {isErrorVisible && (
        <OsdsMessage
          type={ODS_MESSAGE_TYPE.error}
          removable
          onOdsRemoveClick={hideError}
        >
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('updateError', { error: updateError?.response.data.message })}
          </OsdsText>
        </OsdsMessage>
      )} */}
      <Datagrid
        sorting={sorting}
        onSortChange={setSorting}
        columns={columns}
        items={data?.data}
        totalItems={data?.data.length}
        noResultLabel={t('emptyDataGridMessage')}
      />
      <Outlet />
    </>
  );
};
