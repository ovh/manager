import React from 'react';
import { ODS_TEXT_PRESET, ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge, OdsTooltip, OdsText } from '@ovhcloud/ods-components/react';

export type BadgeCellParams = {
  badgeColor: ODS_BADGE_COLOR;
  text: string;
  tooltip?: string;
  trigger?: string;
};

export const BadgeCell = ({
  badgeColor,
  text,
  tooltip,
  trigger,
}: BadgeCellParams) => (
  <>
    <div id={trigger} className="flex items-center">
      <OdsBadge color={badgeColor} label={text} className="mr-2" />
    </div>
    {!!tooltip && !!trigger && (
      <OdsTooltip role="tooltip" triggerId={trigger} className="max-w-48">
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>{tooltip}</OdsText>
      </OdsTooltip>
    )}
  </>
);
