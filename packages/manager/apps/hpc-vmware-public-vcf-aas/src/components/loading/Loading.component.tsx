import React from 'react';
import { OdsSpinner } from '@ovhcloud/ods-components/react';

export default function Loading(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex justify-center" {...props}>
      <div>
        <OdsSpinner />
      </div>
    </div>
  );
}
