/* eslint-disable import/no-extraneous-dependencies */
import { OdsSkeleton } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import { Skeleton } from '@/components/ui/skeleton';

export default {
  story: 'Tailwind',
  customComponentExemple: (
    <div className="flex gap-2 flex-col">
      <Skeleton className="block w-full h-4" />
      <Skeleton className="block w-28 h-4" />
      <Skeleton className="block w-44 h-4" />
      <Skeleton className="block w-full h-24" />
    </div>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <div className="flex gap-2 flex-col">
      <OdsSkeleton className="block w-full h-4" />
      <OdsSkeleton className="block w-28 h-4" />
      <OdsSkeleton className="block w-44 h-4" />
      <OdsSkeleton className="block w-full h-24" />
    </div>
  ),
  ODSComponentResult: StoryResult.fail,
};
