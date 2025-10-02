import React, { useId } from 'react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText, OdsIcon, OdsTooltip } from '@ovhcloud/ods-components/react';

type HelpIconWithTooltipProps = {
  label: string;
};

export const HelpIconWithTooltip = ({ label }: HelpIconWithTooltipProps) => {
  const tooltipId = useId();

  return (
    <>
      <OdsIcon
        id={`trigger-${tooltipId}`}
        aria-labelledby={`tooltip-${tooltipId}`}
        className="text-[--ods-color-form-element-text-default]"
        name="circle-question"
      />
      <OdsTooltip
        id={`tooltip-${tooltipId}`}
        triggerId={`trigger-${tooltipId}`}
        withArrow
      >
        <OdsText preset={ODS_TEXT_PRESET.paragraph} className="w-56">
          <span>{label}</span>
        </OdsText>
      </OdsTooltip>
    </>
  );
};
