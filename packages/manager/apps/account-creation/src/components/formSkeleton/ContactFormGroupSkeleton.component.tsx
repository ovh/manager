import { Skeleton } from '@ovhcloud/ods-react';
import FormFieldSkeleton from './FormFieldSkeleton.component';

export default function ContactFormGroupSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="w-48 h-8" />
      <div className="flex flex-row gap-4 my-4">
        <Skeleton className="w-24 h-7" />
        <Skeleton className="w-24 h-7" />
      </div>
      <FormFieldSkeleton />

      <Skeleton className="w-48 h-8 mt-6" />
      <FormFieldSkeleton />
    </div>
  );
}
