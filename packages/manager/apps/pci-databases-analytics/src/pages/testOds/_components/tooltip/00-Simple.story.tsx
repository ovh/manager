/* eslint-disable import/no-extraneous-dependencies */
import { OdsTooltip } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default {
  story: 'Simple tooltip',
  customComponentExemple: (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Hover</TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <>
      <span id="trigger1">Hover me</span>
      <OdsTooltip triggerId="trigger1">Add to library</OdsTooltip>
    </>
  ),
  ODSComponentResult: StoryResult.warning,
};
