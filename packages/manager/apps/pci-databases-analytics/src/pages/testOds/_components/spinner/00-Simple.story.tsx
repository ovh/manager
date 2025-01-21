/* eslint-disable import/no-extraneous-dependencies */
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { Loader2 } from 'lucide-react';
import { StoryResult } from '../Stories';

export default {
  story: 'Simple spinner',
  customComponentExemple: <Loader2 className="animate-spin text-primary-500" />,
  customComponentResult: StoryResult.success,
  ODSComponentExemple: <OdsSpinner />,
  ODSComponentResult: StoryResult.success,
};
