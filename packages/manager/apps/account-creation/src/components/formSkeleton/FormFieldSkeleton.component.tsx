import { Skeleton } from '@ovhcloud/ods-react';

export default function FormFieldSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="w-32 h-4" />
      <Skeleton className="w-full h-9" />
    </div>
  );
}
