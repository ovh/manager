/* eslint-disable import/no-extraneous-dependencies */
import { Checkbox } from '@datatr-ux/uxlib';
import { OdsCheckbox } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';

export default {
  story: 'Checked checkbox',
  customComponentExemple: <Checkbox className="text-white" checked={true} />,
  customComponentResult: StoryResult.success,
  ODSComponentExemple: <OdsCheckbox name="cb" isChecked={true} />,
  ODSComponentResult: StoryResult.fail,
};
