/* eslint-disable import/no-extraneous-dependencies */
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { Loader2 } from 'lucide-react';
import { StoryResult } from '../Stories';

export default {
  story: 'Tailwind',
  customComponentExemple: (
    <div className="overflow-hidden">
      <Loader2 className="animate-spin text-red-500  w-14 h-14" />
    </div>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: <OdsSpinner className="text-red-500" />,
  ODSComponentResult: StoryResult.fail,
};
