import React from 'react';

import { useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { useTranslation } from 'react-i18next';

import { BUTTON_COLOR, BUTTON_VARIANT, Button, ICON_NAME, Icon, Link } from '@ovhcloud/ods-react';

import { Datagrid, Notifications, useDataApi, useNotifications } from '@ovh-ux/muk';

import Loading from '@/components/loading/Loading.component';
import Topbar from '@/components/topBar/TopBar.component';
import { SslCertificate } from '@/data/types/product/ssl';
import useDatagridColumn from '@/hooks/ssl/useDatagridColumn';

export default function Ssl() {
  const { serviceName } = useParams();
  const { t } = useTranslation('ssl');
  const queryClient = useQueryClient();
  const { addSuccess } = useNotifications();

  const { flattenData, isLoading, fetchNextPage, hasNextPage } = useDataApi({
    version: 'v2',
    route: `/webhosting/resource/${serviceName}/certificate`,
    cacheKey: ['webhosting', 'resource', serviceName, 'certificate'],
    enabled: !!serviceName,
    iceberg: true,
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
        <Link href={url} download={csvConfig.filename} className="ml-4">
          <>
            {t('web_hosting_export_download_manually')}
            <Icon name={ICON_NAME.download} />
          </>
        </Link>
      </div>
    );
    addSuccess(successMessage);
    download(csvConfig)(csv);
  };

  const rawColumns = useDatagridColumn() as Array<{ id: string } & Record<string, unknown>>;

  const columns = rawColumns.map((col) => ({
    ...col,
    accessorFn: (row: Record<string, unknown>) => row[col.id],
  }));

  return (
    <React.Suspense fallback={<Loading />}>
      <Notifications />
      <Topbar />
      <div className="mb-7 flex">
        <div className="w-2/3">
          <Button
            variant={BUTTON_VARIANT.outline}
            color={BUTTON_COLOR.primary}
            onClick={handleExportWithExportToCsv}
            data-testid="ssl-page-export-button"
          >
            <>
              {t('web_hosting_export_label')}
              <Icon name={ICON_NAME.download} />
            </>
          </Button>
        </div>
        <div className="flex w-1/3 flex-wrap justify-end">
          <Button
            variant={BUTTON_VARIANT.outline}
            color={BUTTON_COLOR.primary}
            onClick={() => {
              queryClient.invalidateQueries().catch(console.error);
            }}
          >
            <Icon name={ICON_NAME.refresh} />
          </Button>
        </div>
      </div>
      <Datagrid
        columns={flattenData ? columns : []}
        data={flattenData || []}
        isLoading={isLoading}
        hasNextPage={hasNextPage && !isLoading}
        onFetchNextPage={(): void => {
          void fetchNextPage();
        }}
      />
    </React.Suspense>
  );
}
