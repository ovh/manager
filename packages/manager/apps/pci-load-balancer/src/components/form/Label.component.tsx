import {
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';

type TLabelProps = {
  text: string;
  helpText?: string;
  hasError?: boolean;
  slot?: string;
  className?: string;
};

export default function LabelComponent({
  text,
  helpText,
  hasError,
  slot = 'label',
  className = '',
}: Readonly<TLabelProps>): JSX.Element {
  return (
    <div slot={slot} className={`flex gap-2 items-center ${className}`.trim()}>
      <OsdsText
        color={
          hasError ? ODS_THEME_COLOR_INTENT.error : ODS_THEME_COLOR_INTENT.text
        }
        className="font-bold"
        size={ODS_TEXT_SIZE._100}
        level={ODS_TEXT_LEVEL.caption}
      >
        {text}
      </OsdsText>

      {helpText && (
        <OsdsPopover className="w-4 h-4">
          <OsdsIcon
            slot="popover-trigger"
            name={ODS_ICON_NAME.HELP}
            size={ODS_ICON_SIZE.xxs}
            className="cursor-help"
            color={ODS_THEME_COLOR_INTENT.text}
          />
          <OsdsPopoverContent>{helpText}</OsdsPopoverContent>
        </OsdsPopover>
      )}
    </div>
  );
}
