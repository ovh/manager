import React from 'react';
import { ODS_ICON_NAME, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsIcon, OdsTooltip, OdsText } from '@ovhcloud/ods-components/react';
import { datagridCellStyle } from '../datagridCellStyles';

export type IconCellParams = {
  style?: React.CSSProperties;
  icon: ODS_ICON_NAME;
  text?: string;
  tooltip?: string;
  trigger?: string;
};

export const IconCell = ({
  style = datagridCellStyle.iconDefault,
  icon,
  text,
  tooltip,
  trigger,
}: IconCellParams) => (
  <>
    <div id={trigger} style={style} className="flex items-center">
      <OdsIcon name={icon} className="mr-2" />
      {text}
    </div>
    {!!tooltip && !!trigger && (
      <OdsTooltip role="tooltip" triggerId={trigger} className="max-w-48">
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>{tooltip}</OdsText>
      </OdsTooltip>
    )}
  </>
);
