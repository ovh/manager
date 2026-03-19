import {
  DataGridTextCell,
  priceToUcent,
  useCatalogPrice,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { TSnapshot } from '@/api/hook/useConsumption';
import TooltipIcon from './TooltipIcon.component';

export function useSnapshotListColumns() {
  const { t } = useTranslation('consumption/hourly-instance/snapshot');

  const { translateMicroRegion } = useTranslatedMicroRegions();

  const { getTextPrice } = useCatalogPrice(2);

  const getSnapshotPriceInfoTooltip = (snapshot: TSnapshot) =>
    `${t('cpbc_snapshot_col_usage_info_part1')} ${t(
      'cpbc_snapshot_col_usage_info_part2',
      {
        amount: getTextPrice(
          priceToUcent(snapshot.instance?.quantity?.value || 0),
        ),
      },
    )}`;

  return [
    {
      id: 'location',
      cell: (row: TSnapshot) => (
        <DataGridTextCell>{translateMicroRegion(row?.region)}</DataGridTextCell>
      ),
      label: t('cpbc_snapshot_col_location'),
    },
    {
      id: 'type',
      cell: () => (
        <DataGridTextCell>{t('cpbc_snapshot_type_instance')}</DataGridTextCell>
      ),
      label: t('cpbc_snapshot_col_type'),
    },
    {
      id: 'usage',
      cell: (row: TSnapshot) => (
        <div className="flex gap-2">
          <DataGridTextCell>
            {getTextPrice(priceToUcent(row?.totalPrice || 0))}
          </DataGridTextCell>
          <TooltipIcon
            icon={ODS_ICON_NAME.HELP}
            content={getSnapshotPriceInfoTooltip(row)}
          />
        </div>
      ),
      label: t('cpbc_snapshot_col_usage'),
    },
  ];
}
