import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import {
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsText,
} from '@ovhcloud/ods-components/react';

export default function Popover({ content }: { content: string }) {
  return (
    <OsdsPopover>
      <span slot="popover-trigger">
        <OsdsIcon
          name={ODS_ICON_NAME.HELP}
          size={ODS_ICON_SIZE.xxs}
          color={ODS_THEME_COLOR_INTENT.primary}
          className="cursor-help"
        />
      </span>
      <OsdsPopoverContent>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
        >
          {content}
        </OsdsText>
      </OsdsPopoverContent>
    </OsdsPopover>
  );
}
