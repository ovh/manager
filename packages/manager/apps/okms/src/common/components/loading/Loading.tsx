import { Spinner } from '@ovhcloud/ods-react';

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
