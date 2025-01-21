/* eslint-disable import/no-extraneous-dependencies */
import { OdsProgressBar } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import { Progress } from '@/components/ui/progress';

export default {
  story: 'Simple progressbar',
  customComponentExemple: (
    <Progress
      value={50}
      className="h-2 bg-gray-100 text-red-500"
      indicatorClassName="bg-red-500"
    />
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <div className="grid">
      <OdsProgressBar value={50} className="bg-red-500" />
    </div>
  ),
  ODSComponentResult: StoryResult.fail,
};
