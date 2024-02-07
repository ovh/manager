import { OsdsClipboard, OsdsTooltip } from '@ovhcloud/ods-components/react';
import { ODS_TOOLTIP_VARIANT } from '@ovhcloud/ods-components';
import DataGridTextCell from '../../datagrid/DataGridTextCell';

export default function Key({ publicKey }: { publicKey: string }) {
  return (
    <DataGridTextCell>
      <OsdsClipboard value={publicKey}>
        <OsdsTooltip variant={ODS_TOOLTIP_VARIANT.tip} slot={'success-message'}>
          Test
        </OsdsTooltip>
        <OsdsTooltip variant={ODS_TOOLTIP_VARIANT.tip} slot={'success-message'}>
          Error
        </OsdsTooltip>
      </OsdsClipboard>
    </DataGridTextCell>
  );
}
