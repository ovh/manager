import { Skeleton } from '@ovhcloud/ods-react';

export { default as FormGroupSkeleton } from './FormGroupSkeleton.component';
export { default as AddressFormGroupSkeleton } from './AddressFormGroupSkeleton.component';
export { default as ContactFormGroupSkeleton } from './ContactFormGroupSkeleton.component';

export function CheckboxSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="w-full h-7" />
    </div>
  );
}

export function ButtonSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="w-full h-10" />
    </div>
  );
}
