import { Skeleton } from '@ovhcloud/ods-react';
import FormFieldSkeleton from './FormFieldSkeleton.component';

export default function FormGroupSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="w-48 h-8" />
      <FormFieldSkeleton />
      <FormFieldSkeleton />
    </div>
  );
}
