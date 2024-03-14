import { OsdsSpinner } from '@ovhcloud/ods-components/react';

export default function Loading() {
  return (
    <div className="flex justify-center">
      <div>
        <OsdsSpinner className="w-16 h-16 my-20" />
      </div>
    </div>
  );
}
