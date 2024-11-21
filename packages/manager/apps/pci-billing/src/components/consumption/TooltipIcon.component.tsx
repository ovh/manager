import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsIcon,
  OsdsText,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';

export default function TooltipIcon({
  icon,
  content,
}: Readonly<{
  icon: ODS_ICON_NAME;
  content: string;
}>) {
  return (
    <OsdsTooltip>
      <OsdsIcon
        name={icon}
        size={ODS_ICON_SIZE.xxs}
        color={ODS_THEME_COLOR_INTENT.text}
        className="cursor-pointer"
      />
      <OsdsTooltipContent slot="tooltip-content">
        <OsdsText
          size={ODS_TEXT_SIZE._100}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
          className="break-normal"
        >
          {content}
        </OsdsText>
      </OsdsTooltipContent>
    </OsdsTooltip>
  );
}
