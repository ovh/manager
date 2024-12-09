import {
  DataGridTextCell,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import TooltipIcon from './TooltipIcon.component';
import { TStorage } from '@/api/hook/useConsumption';

export function useArchiveStorageListColumns() {
  const { t } = useTranslation('consumption/hourly-instance/archive-storage');

  const { currency } = useContext(ShellContext).environment.getUser();
  const { translateMicroRegion } = useTranslatedMicroRegions();

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

  return [
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
}
