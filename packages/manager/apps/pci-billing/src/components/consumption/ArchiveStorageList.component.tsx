import {
  Datagrid,
  DataGridTextCell,
  useDataGrid,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { paginateResults } from '@/api/data/consumption';
import NoDataMessage from './NoDataMessage.component';
import TooltipIcon from './TooltipIcon.component';
import { TStorage } from '@/api/hook/useConsumption';

type StorageListProps = {
  storages: TStorage[];
};

export default function ArchiveStorageList({
  storages,
}: Readonly<StorageListProps>) {
  const { t } = useTranslation('consumption/hourly-instance/archive-storage');

  const { currency } = useContext(ShellContext).environment.getUser();
  const { translateMicroRegion } = useTranslatedMicroRegions();
  const { pagination, setPagination } = useDataGrid();

  const getStoragePriceInfoTooltip = (storage: TStorage) =>
    `${t('cpbc_archive_storage_consumption_info_part1')}${t(
      'cpbc_archive_storage_consumption_info_part2',
      {
        amount: storage.stored?.quantity?.value || 0,
      },
    )}`;

  const getStorageIncomingBandwidthInfoTooltip = (storage: TStorage) =>
    `${t('cpbc_archive_storage_input_traffic_info_part1')}${t(
      'cpbc_archive_storage_input_traffic_info_part2',
      {
        amount: storage.incomingBandwidth?.quantity?.value || 0,
      },
    )}`;

  const getStorageOutgoingBandwidthInfoTooltip = (storage: TStorage) =>
    `${t('cpbc_archive_storage_output_traffic_info_part1')}${t(
      'cpbc_archive_storage_output_traffic_info_part2',
      {
        amount: storage.outgoingBandwidth?.quantity?.value || 0,
      },
    )}`;

  const paginatedStorages = useMemo(() => {
    const sortedStorages = storages?.sort((a, b) =>
      a.region.localeCompare(b.region),
    );
    return paginateResults(sortedStorages || [], pagination);
  }, [storages, pagination, setPagination]);

  const columns = [
    {
      id: 'location',
      cell: (row: TStorage) => (
        <DataGridTextCell>{translateMicroRegion(row?.region)}</DataGridTextCell>
      ),
      label: t('cpbc_archive_storage_col_location'),
    },
    {
      id: 'consumption',
      cell: (row: TStorage) => (
        <div className="flex gap-2">
          <DataGridTextCell>
            {`${(row?.stored?.totalPrice || 0).toFixed(2)} ${currency.symbol}`}
          </DataGridTextCell>
          <TooltipIcon
            icon={ODS_ICON_NAME.HELP}
            content={getStoragePriceInfoTooltip(row)}
          />
        </div>
      ),
      label: t('cpbc_archive_storage_col_consumption'),
    },
    {
      id: 'input-traffic',
      cell: (row: TStorage) => (
        <div className="flex gap-2">
          <DataGridTextCell>
            {`${(row?.incomingBandwidth?.totalPrice || 0).toFixed(2)} ${
              currency.symbol
            }`}
          </DataGridTextCell>
          <TooltipIcon
            icon={ODS_ICON_NAME.HELP}
            content={getStorageIncomingBandwidthInfoTooltip(row)}
          />
        </div>
      ),
      label: t('cpbc_archive_storage_col_input_traffic'),
    },
    {
      id: 'output-traffic',
      cell: (row: TStorage) => (
        <div className="flex gap-2">
          <DataGridTextCell>
            {`${(row?.outgoingBandwidth?.totalPrice || 0).toFixed(2)} ${
              currency.symbol
            }`}
          </DataGridTextCell>
          <TooltipIcon
            icon={ODS_ICON_NAME.HELP}
            content={getStorageOutgoingBandwidthInfoTooltip(row)}
          />
        </div>
      ),
      label: t('cpbc_archive_storage_col_output_traffic'),
    },
  ];

  if (paginatedStorages.totalRows === 0) {
    return <NoDataMessage message={t('cpbc_no_consumption_data')} />;
  }

  return (
    <div className="my-3">
      <Datagrid
        columns={columns}
        items={paginatedStorages.rows}
        totalItems={paginatedStorages.totalRows}
        pagination={pagination}
        onPaginationChange={setPagination}
        className="overflow-x-visible"
      />
    </div>
  );
}
