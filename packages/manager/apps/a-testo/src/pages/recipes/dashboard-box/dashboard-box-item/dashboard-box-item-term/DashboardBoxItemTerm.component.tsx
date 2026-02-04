import {
  Icon,
  TEXT_PRESET,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import { DashboardBoxItemTermProps } from './DashboardBoxItemTerm.props';

export const DashboardBoxItemTerm = ({
  label,
  tooltip,
  actions,
  ...rest
}: DashboardBoxItemTermProps) => {
  return (
    <dt className="flex justify-between" {...rest}>
      <div className="flex items-center gap-1 text-[var(--ods-color-text)]">
        <Text preset={TEXT_PRESET.span} className="font-bold">
          {label}
        </Text>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Icon name="circle-question" />
            </TooltipTrigger>
            <TooltipContent>
              <Text preset={TEXT_PRESET.paragraph}>{tooltip}</Text>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      {actions && actions}
    </dt>
  );
};
