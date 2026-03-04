import {
  BADGE_COLOR,
  Badge,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

export type BadgeCellParams = {
  badgeColor: BADGE_COLOR;
  text: string;
  tooltip?: string;
};

export const BadgeCell = ({ badgeColor, text, tooltip }: BadgeCellParams) => (
  <div className="flex items-center">
    {tooltip ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge color={badgeColor} className="mr-2">
            {text}
          </Badge>
        </TooltipTrigger>
        <TooltipContent withArrow>{tooltip}</TooltipContent>
      </Tooltip>
    ) : (
      <Badge color={badgeColor} className="mr-2">
        {text}
      </Badge>
    )}
  </div>
);
