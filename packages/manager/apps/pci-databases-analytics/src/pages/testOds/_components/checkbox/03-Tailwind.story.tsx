/* eslint-disable import/no-extraneous-dependencies */
import { Checkbox } from '@datatr-ux/uxlib';
import { OdsCheckbox } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';

export default {
  story: 'Tailwind',
  customComponentExemple: (
    <Checkbox className="text-primary bg-green-50 data-[state=checked]:bg-green-500 data-[state=checked]:text-white" />
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <OdsCheckbox
      name="cb"
      className="text-primary bg-green-50 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
    />
  ),
  ODSComponentResult: StoryResult.fail,
};
