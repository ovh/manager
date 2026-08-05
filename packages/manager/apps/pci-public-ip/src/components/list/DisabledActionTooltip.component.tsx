import { PropsWithChildren } from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsText,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';

type DisabledActionTooltipProps = PropsWithChildren<{
  reason?: string;
}>;

export default function DisabledActionTooltip({
  reason,
  children,
}: Readonly<DisabledActionTooltipProps>) {
  if (!reason) {
    return <>{children}</>;
  }

  return (
    <OsdsTooltip>
      {children}
      <OsdsTooltipContent slot="tooltip-content">
        <OsdsText
          size={ODS_TEXT_SIZE._100}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
          className="break-normal"
        >
          {reason}
        </OsdsText>
      </OsdsTooltipContent>
    </OsdsTooltip>
  );
}
