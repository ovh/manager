import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ODS_SPINNER_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import {
  OsdsText,
  OsdsDivider,
  OsdsBreadcrumb,
  OsdsButton,
  OsdsMessage,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import {
  DataGridClipboardCell,
  DataGridRegionCell,
  DataGridTextCell,
  Datagrid,
  Notifications,
  PciGuidesHeader,
  useDatagridSearchParams,
} from '@ovhcloud/manager-components';
import { useOKMS } from '@/hooks/useOKMS';
import { OKMS } from '@/interface';

export default function Listing() {
  const { t } = useTranslation('key-management-system/listing');
  const { t: tError } = useTranslation('error');

  const columns = [
    {
      id: 'name',
      cell: (props: OKMS) => {
        return <DataGridTextCell>{props.iam.displayName}</DataGridTextCell>;
      },
      label: t('key_management_service_name_cell'),
    },
    {
      id: 'id',
      cell: (props: OKMS) => {
        return <DataGridClipboardCell text={props.id} />;
      },
      label: t('key_management_service_id_cell'),
    },
    {
      id: 'region',
      cell: (props: OKMS) => {
        return <DataGridRegionCell region={props.region} />;
      },
      label: t('key_management_service_region_cell'),
    },
  ];

  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
  } = useDatagridSearchParams();

  const { error, data: okms, isLoading } = useOKMS({
    pagination,
    sorting,
  });

  return (
    <>
      <OsdsBreadcrumb
        items={[
          {
            href: '/key-management-system/',
            label: t('key_management_service_title'),
          },
        ]}
      ></OsdsBreadcrumb>
      <div className={'flex items-center justify-between mt-4'}>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          size={ODS_THEME_TYPOGRAPHY_SIZE._600}
          color={ODS_THEME_COLOR_INTENT.primary}
        >
          {t('key_management_service_title')}
        </OsdsText>
        <PciGuidesHeader category="storage"></PciGuidesHeader>
      </div>
      <OsdsDivider></OsdsDivider>
      <Notifications />
      <div className={'flex mb-3 mt-6'}>
        <OsdsButton
          className="mr-1"
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          href={''}
        >
          {t('key_management_service_add_kms_button')}
        </OsdsButton>
      </div>
      {error && (
        <OsdsMessage className="mt-4" type={ODS_MESSAGE_TYPE.error}>
          {tError('manager_error_page_default')}
        </OsdsMessage>
      )}

      {isLoading && !error && (
        <div className="text-center">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        </div>
      )}
      {!isLoading && !error && (
        <div className={'mt-8'}>
          <Datagrid
            columns={columns}
            items={okms?.rows || []}
            totalItems={okms?.totalRows || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
            sorting={sorting}
            onSortChange={setSorting}
            contentAlignLeft
          />
        </div>
      )}
    </>
  );
}
