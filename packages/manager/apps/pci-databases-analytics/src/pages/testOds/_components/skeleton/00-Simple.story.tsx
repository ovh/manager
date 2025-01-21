/* eslint-disable import/no-extraneous-dependencies */
import { OdsSkeleton } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import { Skeleton } from '@/components/ui/skeleton';

export default {
  story: 'Simple skeleton',
  customComponentExemple: <Skeleton className="block w-full h-4" />,
  customComponentResult: StoryResult.success,
  ODSComponentExemple: <OdsSkeleton />,
  ODSComponentResult: StoryResult.success,
};
