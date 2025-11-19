import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OdsSpinner } from '@ovhcloud/ods-components/react';

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <OdsSpinner size={ODS_SPINNER_SIZE.lg} />
    </div>
  );
}
