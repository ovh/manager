/* eslint-disable import/no-extraneous-dependencies */
import { OdsPopover } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default {
  story: 'Tailwind',
  customComponentExemple: (
    <Popover>
      <PopoverTrigger>Trigger</PopoverTrigger>
      <PopoverContent side='top' className="border-2 border-orange-500 bg-blue-100 rounded-none">
        Popover content
      </PopoverContent>
    </Popover>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <>
      <div id="trigger2">Trigger</div>
      <OdsPopover
        triggerId="trigger2"
        className="border-2 border-orange-500 bg-blue-100 rounded-xl"
      >
        <div>Popover content</div>
      </OdsPopover>
    </>
  ),
  ODSComponentResult: StoryResult.success,
};
