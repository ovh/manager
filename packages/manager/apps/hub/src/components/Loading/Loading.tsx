import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';

export default function Loading() {
  return (
    <div className="flex justify-center h-screen items-center">
      <OsdsSpinner size={ODS_SPINNER_SIZE.lg} inline />
    </div>
  );
}
