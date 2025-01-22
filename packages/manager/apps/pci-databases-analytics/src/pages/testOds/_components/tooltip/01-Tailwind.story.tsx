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
  story: 'Tailwind',
  customComponentExemple: (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Hover</TooltipTrigger>
        <TooltipContent className="bg-orange-200 text-primary-500">
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <>
      <span id="trigger2">Hover me</span>
      <OdsTooltip
        triggerId="trigger2"
        className="bg-orange-200 text-primary-500"
      >
        Add to library
      </OdsTooltip>
    </>
  ),
  ODSComponentResult: StoryResult.success,
};
