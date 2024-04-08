/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OsdsDatagrid,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  OdsDatagridColumn,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  ShellContext,
  ovhLocaleToI18next,
} from '@ovh-ux/manager-react-shell-client';
import { reactFormatter } from '@/utils/ods-utils';
import {
  DisplayNameCell,
  ProductStatusCell,
  VrackIdCell,
  CreatedAtCell,
  RegionCell,
} from '@/components/VrackServicesDataGridCells';
import { useUpdateVrackServices, useVrackServicesList } from '@/utils/vs-utils';
import { urls } from '@/router/constants';

export const VrackServicesDatagrid: React.FC = () => {
  const { t, i18n } = useTranslation('vrack-services/listing');
  const {
    shell: {
      tracking: { trackPage },
    },
  } = React.useContext(ShellContext);
  const navigate = useNavigate();
  const {
    updateVS,
    isPending,
    isErrorVisible,
    updateError,
    hideError,
  } = useUpdateVrackServices({ key: 'listing' });

  const { data } = useVrackServicesList();

  const columns: OdsDatagridColumn[] = [
    {
      title: t('displayName'),
      field: 'currentState.displayName',
      isSortable: true,
      formatter: reactFormatter(
        <DisplayNameCell
          navigate={navigate}
          updateVS={updateVS}
          trackPage={trackPage}
        />,
      ),
    },
    {
      title: t('productStatus'),
      field: 'currentState.productStatus',
      isSortable: true,
      formatter: reactFormatter(<ProductStatusCell t={t} />),
    },
    {
      title: t('region'),
      field: 'currentState.region',
      isSortable: true,
      formatter: reactFormatter(<RegionCell t={t} />),
    },
    {
      title: t('vrackId'),
      field: 'currentState.vrackId',
      formatter: reactFormatter(
        <VrackIdCell
          label={t('associateVrackButtonLabel')}
          isLoading={isPending}
          openAssociationModal={(id) => {
            navigate(urls.listingAssociate.replace(':id', id));
          }}
        />,
      ),
    },
    {
      title: t('createdAt'),
      field: 'createdAt',
      isSortable: true,
      formatter: reactFormatter(
        <CreatedAtCell locale={ovhLocaleToI18next(i18n.language)} />,
      ),
    },
    // {
    //   title: t('actions'),
    //   field: '',
    //   formatter: reactFormatter(
    //     <ActionsCell
    //       openModal={(id) => navigate(urls.listingDelete.replace(':id', id))}
    //       isLoading={isPending}
    //     />,
    //   ),
    // },
  ];

  return (
    <>
      {isErrorVisible && (
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
      )}
      <OsdsDatagrid
        hasHideableColumns={undefined}
        height={(data?.data.length + 1) * 150}
        rowHeight={60}
        columns={columns}
        rows={data?.data}
        noResultLabel={t('emptyDataGridMessage')}
      />
      <Outlet />
    </>
  );
};
