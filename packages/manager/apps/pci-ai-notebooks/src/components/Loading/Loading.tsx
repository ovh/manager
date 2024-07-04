import { OsdsSpinner } from '@ovhcloud/ods-components/react';

export default function Loading() {
  return (
    <div className="flex justify-center" data-testid="loading-container">
      <div>
        <OsdsSpinner data-testid="osds-spinner" className="w-16 h-16 my-20" />
      </div>
    </div>
  );
}
