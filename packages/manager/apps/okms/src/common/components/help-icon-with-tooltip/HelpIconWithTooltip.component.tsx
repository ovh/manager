import { Icon, Text, Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';

type HelpIconWithTooltipProps = {
  label: string;
  iconColorClass?: string;
};

export const HelpIconWithTooltip = ({
  label,
  iconColorClass = 'text-[--ods-color-form-element-text-default]',
}: HelpIconWithTooltipProps) => {
  return (
    <Tooltip
      positionerStyle={{
        zIndex: 'calc(var(--ods-theme-overlay-z-index) + 100',
      }}
    >
      <TooltipTrigger asChild>
        <Icon aria-labelledby={label} className={iconColorClass} name="circle-question" />
      </TooltipTrigger>
      <TooltipContent className="w-56">
        <Text preset="small">
          <span>{label}</span>
        </Text>
      </TooltipContent>
    </Tooltip>
  );
};
