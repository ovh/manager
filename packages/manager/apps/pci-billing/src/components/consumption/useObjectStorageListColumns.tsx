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

export function useObjectStorageListColumns() {
  const { t } = useTranslation('consumption/hourly-instance/object-storage');
  const { currency } = useContext(ShellContext).environment.getUser();
  const { translateMicroRegion } = useTranslatedMicroRegions();
  const getStorageVolumeInfoTooltip = (storage: TStorage) =>
    `${t('cpbc_object_storage_consumption_info_part1')}${t(
      'cpbc_object_storage_consumption_info_part2',
      {
        amount: storage.stored?.quantity?.value || 0,
      },
    )}`;

  const getStorageBandwidthInfoTooltip = (storage: TStorage) =>
    `${t('cpbc_object_storage_output_traffic_info_part1')}${t(
      'cpbc_object_storage_output_traffic_info_part2',
      {
        amount: storage.outgoingBandwidth?.quantity?.value || 0,
      },
    )}`;

  return [
    {
      id: 'location',
      cell: (row: TStorage) => (
        <DataGridTextCell>{translateMicroRegion(row.region)}</DataGridTextCell>
      ),
      label: t('cpbc_object_storage_col_location'),
    },
    {
      id: 'consumption',
      cell: (row: TStorage) => (
        <div className="flex gap-2">
          <DataGridTextCell>
            {`${(row.stored?.totalPrice || 0).toFixed(2)} ${currency.symbol}`}
          </DataGridTextCell>
          <TooltipIcon
            icon={ODS_ICON_NAME.HELP}
            content={getStorageVolumeInfoTooltip(row)}
          />
        </div>
      ),
      label: t('cpbc_object_storage_col_consumption'),
    },
    {
      id: 'traffic',
      cell: (row: TStorage) => (
        <div className="flex gap-2">
          <DataGridTextCell>
            {`${(row.outgoingBandwidth?.totalPrice || 0).toFixed(2)} ${
              currency.symbol
            }`}
          </DataGridTextCell>
          <TooltipIcon
            icon={ODS_ICON_NAME.HELP}
            content={getStorageBandwidthInfoTooltip(row)}
          />
        </div>
      ),
      label: t('cpbc_object_storage_col_output_traffic'),
    },
  ];
}
