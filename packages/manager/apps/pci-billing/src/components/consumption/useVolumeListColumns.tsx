import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  OsdsPopover,
  OsdsPopoverContent,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import TooltipIcon from './TooltipIcon.component';
import VolumeDetailPopover from './VolumeDetailPopover.component';

export type TMappedVolume = {
  totalPrice: string;
  volumeId: string;
  quantity: number;
  region: string;
  type: string;
  amount: number;
  name: string;
  size?: number;
  status: string;
};

export function useVolumeListColumns() {
  const { t } = useTranslation('consumption/hourly-instance/volume');
  const getVolumePriceInfoTooltip = (volume: TMappedVolume) =>
    `${t('cpbc_volume_consumption_tooltip_part1')} ${t(
      'cpbc_volume_consumption_tooltip_part2',
      {
        amount: volume.amount,
      },
    )}`;
  return [
    {
      id: 'name',
      cell: (row: TMappedVolume) => (
        <DataGridTextCell>
          <OsdsPopover>
            <div slot="popover-trigger" className="cursor-pointer">
              {row.name}
            </div>
            <OsdsPopoverContent>
              <VolumeDetailPopover row={row} />
            </OsdsPopoverContent>
          </OsdsPopover>
        </DataGridTextCell>
      ),
      label: t('cpbc_volume_col_name'),
    },
    {
      id: 'consumption',
      cell: (row: TMappedVolume) => (
        <div className="flex gap-2">
          <DataGridTextCell>{row.totalPrice}</DataGridTextCell>
          <TooltipIcon
            icon={ODS_ICON_NAME.HELP}
            content={getVolumePriceInfoTooltip(row)}
          />
        </div>
      ),
      label: t('cpbc_volume_col_consumption'),
    },
  ];
}
