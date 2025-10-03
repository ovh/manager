import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';

const PopoverTrigger = ({ title }: { title: string }) => (
  <span slot="popover-trigger">
    <OsdsText
      className="mb-4"
      size={ODS_TEXT_SIZE._200}
      level={ODS_TEXT_LEVEL.heading}
      color={ODS_TEXT_COLOR_INTENT.text}
      onClick={(event) => event.stopPropagation()}
    >
      {title}
    </OsdsText>
    <OsdsIcon
      name={ODS_ICON_NAME.HELP}
      size={ODS_ICON_SIZE.xs}
      className="ml-4 cursor-help"
      color={ODS_TEXT_COLOR_INTENT.primary}
    />
  </span>
);

export default PopoverTrigger;
