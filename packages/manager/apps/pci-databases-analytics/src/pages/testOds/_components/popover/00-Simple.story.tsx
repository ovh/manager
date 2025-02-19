/* eslint-disable import/no-extraneous-dependencies */
import { OdsPopover } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default {
  story: 'Simple popover',
  customComponentExemple: (
    <Popover>
      <PopoverTrigger>Trigger</PopoverTrigger>
      <PopoverContent side='top'>Popover content</PopoverContent>
    </Popover>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <>
      <div id="trigger">Trigger</div>
      <OdsPopover triggerId="trigger">
        <div>Popover content</div>
      </OdsPopover>
    </>
  ),
  ODSComponentResult: StoryResult.warning,
};
