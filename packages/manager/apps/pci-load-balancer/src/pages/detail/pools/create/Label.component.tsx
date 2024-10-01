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
  slot,
  className = '',
}: Readonly<TLabelProps>): JSX.Element {
  return (
    <div slot={slot} className={`border border-black ${className}`.trim()}>
      <OsdsText
        color={
          hasError ? ODS_THEME_COLOR_INTENT.error : ODS_THEME_COLOR_INTENT.text
        }
        className="align-super"
        size={ODS_TEXT_SIZE._100}
        level={ODS_TEXT_LEVEL.subheading}
      >
        {text}
      </OsdsText>
      {helpText && (
        <OsdsPopover>
          <span slot="popover-trigger">
            <OsdsIcon
              name={ODS_ICON_NAME.HELP}
              size={ODS_ICON_SIZE.xs}
              className="cursor-help ml-3 mt-3 w-7"
              color={ODS_THEME_COLOR_INTENT.text}
            ></OsdsIcon>
          </span>
          <OsdsPopoverContent>{helpText}</OsdsPopoverContent>
        </OsdsPopover>
      )}
    </div>
  );
}
