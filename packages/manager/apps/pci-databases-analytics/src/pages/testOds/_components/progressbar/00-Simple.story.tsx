/* eslint-disable import/no-extraneous-dependencies */
import { OdsProgressBar } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import { Progress } from '@/components/ui/progress';

export default {
  story: 'Simple progressbar',
  customComponentExemple: <Progress value={50} className="h-2 bg-gray-100" />,
  customComponentResult: StoryResult.success,
  ODSComponentExemple: <OdsProgressBar value={50} />,
  ODSComponentResult: StoryResult.success,
};
