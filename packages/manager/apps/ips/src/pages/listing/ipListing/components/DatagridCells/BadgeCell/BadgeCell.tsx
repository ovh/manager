import React from 'react';

import { ODS_BADGE_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsBadge, OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';

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
        <OdsText
          className="max-w-[200px] p-2"
          preset={ODS_TEXT_PRESET.paragraph}
        >
          {tooltip}
        </OdsText>
      </OdsTooltip>
    )}
  </>
);
