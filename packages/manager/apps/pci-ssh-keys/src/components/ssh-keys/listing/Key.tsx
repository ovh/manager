import { OsdsClipboard, OsdsTooltip } from '@ovhcloud/ods-components/react';
import { ODS_TOOLTIP_VARIANT } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

export default function Key({ publicKey }: { publicKey: string }) {
  return (
    <OsdsClipboard value={publicKey} color={ODS_THEME_COLOR_INTENT.primary}>
      <OsdsTooltip
        variant={ODS_TOOLTIP_VARIANT.tip}
        slot={'success-message'}
        color={ODS_THEME_COLOR_INTENT.primary}
      >
        Success
      </OsdsTooltip>
      <OsdsTooltip
        variant={ODS_TOOLTIP_VARIANT.tip}
        slot={'error-message'}
        color={ODS_THEME_COLOR_INTENT.primary}
      >
        Error
      </OsdsTooltip>
    </OsdsClipboard>
  );
}
