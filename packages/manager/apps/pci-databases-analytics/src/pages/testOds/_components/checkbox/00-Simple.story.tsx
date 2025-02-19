/* eslint-disable import/no-extraneous-dependencies */
import { Checkbox } from '@datatr-ux/uxlib';
import { OdsCheckbox } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';

export default {
  story: 'Simple checkbox',
  customComponentExemple: <Checkbox className="text-white" />,
  customComponentResult: StoryResult.success,
  ODSComponentExemple: <OdsCheckbox name="cb" />,
  ODSComponentResult: StoryResult.success,
};
