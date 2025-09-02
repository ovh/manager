import React from 'react';

import { useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_LINK_ICON_ALIGNMENT,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsLink } from '@ovhcloud/ods-components/react';

import {
  Datagrid,
  Notifications,
  useNotifications,
  useResourcesIcebergV2,
} from '@ovh-ux/manager-react-components';

import Loading from '@/components/loading/Loading.component';
import Topbar from '@/components/topBar/TopBar.component';
import { SslCertificate } from '@/data/types/product/ssl';
import useDatagridColumn from '@/hooks/ssl/useDatagridColumn';

export default function Ssl() {
  const { serviceName } = useParams();
  const { t } = useTranslation('ssl');
  const queryClient = useQueryClient();
  const { addSuccess } = useNotifications();

  const { flattenData, hasNextPage, fetchNextPage, isLoading } = useResourcesIcebergV2({
    route: `/webhosting/resource/${serviceName}/certificate`,
    queryKey: ['webhosting', 'resource', serviceName, 'certificate'],
  });

  interface ExportColumn {
    id: string;
    label: string;
    getValue: (item: SslCertificate) => string;
  }

  const handleExportWithExportToCsv = () => {
    const csvConfig = mkConfig({
      filename: t('ssl'),
      fieldSeparator: ',',
      quoteStrings: true,
      useKeysAsHeaders: true,
    });

    const exportColumns: ExportColumn[] = [
      {
        id: 'mainDomain',
        label: t('cell_main_domain'),
        getValue: (item) => item?.currentState?.mainDomain,
      },
      {
        id: 'additionalDomain',
        label: t('cell_additional_domain'),
        getValue: (item) => item?.currentState?.additionalDomains?.toString(),
      },
      {
        id: 'type',
        label: t('cell_certificate_type'),
        getValue: (item) => item?.currentState?.certificateType,
      },
      {
        id: 'state',
        label: t('cell_state'),
        getValue: (item) => item?.currentState?.state,
      },
      {
        id: 'creationDate',
        label: t('cell_creation_date'),
        getValue: (item) => item?.currentState?.createdAt,
      },
      {
        id: 'expirationDate',
        label: t('cell_expiration_date'),
        getValue: (item) => item?.currentState?.expiredAt,
      },
    ];

    const csvData = flattenData?.map((item: SslCertificate) =>
      exportColumns.reduce(
        (acc, column) => ({
          ...acc,
          [column.label]: column.getValue(item),
        }),
        {},
      ),
    );

    const csv = generateCsv(csvConfig)(csvData);
    const csvString = csv as unknown as string;
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const successMessage = (
      <div>
        {t('web_hosting_export_success')}
        <OdsLink
          href={url}
          download={csvConfig.filename}
          label={t('web_hosting_export_download_manually')}
          className="ml-4"
          icon={ODS_ICON_NAME.download}
          iconAlignment={ODS_LINK_ICON_ALIGNMENT.right}
        />
      </div>
    );
    addSuccess(successMessage);
    download(csvConfig)(csv);
  };

  const columns = useDatagridColumn();

  return (
    <React.Suspense fallback={<Loading />}>
      <Notifications />
      <Topbar />
      <div className="flex mb-7">
        <div className="w-2/3">
          <OdsButton
            label={t('web_hosting_export_label')}
            variant={ODS_BUTTON_VARIANT.outline}
            color={ODS_BUTTON_COLOR.primary}
            icon={ODS_ICON_NAME.download}
            iconAlignment={ODS_LINK_ICON_ALIGNMENT.right}
            onClick={handleExportWithExportToCsv}
            data-testid="websites-page-export-button"
          />
        </div>
        <div className="flex flex-wrap justify-end w-1/3">
          <OdsButton
            variant={ODS_BUTTON_VARIANT.outline}
            color={ODS_BUTTON_COLOR.primary}
            label=""
            icon={ODS_ICON_NAME.refresh}
            onClick={() => {
              queryClient.invalidateQueries().catch(console.error);
            }}
          />
        </div>
      </div>

      {columns && (
        <Datagrid
          columns={columns}
          items={flattenData || []}
          totalItems={flattenData?.length || 0}
          hasNextPage={hasNextPage && !isLoading}
          onFetchNextPage={fetchNextPage}
          isLoading={isLoading}
        />
      )}
    </React.Suspense>
  );
}
