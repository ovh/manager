import React from 'react';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';

export default function Loading(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex justify-center" {...props}>
      <div>
        <OsdsSpinner />
      </div>
    </div>
  );
}
