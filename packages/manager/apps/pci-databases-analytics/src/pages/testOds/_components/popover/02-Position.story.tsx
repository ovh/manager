/* eslint-disable import/no-extraneous-dependencies */
import { OdsPopover } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default {
  story: 'Position bottom',
  customComponentExemple: (
    <Popover>
      <PopoverTrigger>Trigger</PopoverTrigger>
      <PopoverContent side="bottom">Popover content</PopoverContent>
    </Popover>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <>
      <div id="trigger3">Trigger</div>
      <OdsPopover triggerId="trigger3" position="bottom">
        <div>Popover content</div>
      </OdsPopover>
    </>
  ),
  ODSComponentResult: StoryResult.fail,
};
