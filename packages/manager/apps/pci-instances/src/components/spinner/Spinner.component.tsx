import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { FC } from 'react';

export const Spinner: FC = () => (
  <div className="text-center">
    <OsdsSpinner inline={true} size={ODS_SPINNER_SIZE.md} />
  </div>
);
