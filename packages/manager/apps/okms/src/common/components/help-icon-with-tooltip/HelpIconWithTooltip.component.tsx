import { useId } from 'react';

import { OdsIcon, OdsTooltip } from '@ovhcloud/ods-components/react';
import { Text } from '@ovhcloud/ods-react';

type HelpIconWithTooltipProps = {
  label: string;
  iconColorClass?: string;
};

export const HelpIconWithTooltip = ({
  label,
  iconColorClass = 'text-[--ods-color-form-element-text-default]',
}: HelpIconWithTooltipProps) => {
  const tooltipId = useId();

  return (
    <>
      <OdsIcon
        id={`trigger-${tooltipId}`}
        aria-labelledby={`tooltip-${tooltipId}`}
        className={iconColorClass}
        name="circle-question"
      />
      <OdsTooltip id={`tooltip-${tooltipId}`} triggerId={`trigger-${tooltipId}`} withArrow>
        <Text preset="paragraph" className="w-56">
          <span>{label}</span>
        </Text>
      </OdsTooltip>
    </>
  );
};
