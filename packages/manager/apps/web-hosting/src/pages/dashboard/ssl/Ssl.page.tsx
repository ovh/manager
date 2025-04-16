import React, { useState } from 'react';

import { OdsMessage } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';

export default function Ssl() {
  const [message, setMessage] = useState({ status: null, label: '' });

  return (
    <React.Suspense>
      {message?.status && (
        <div className="w-full mb-10">
          <OdsMessage
            isDismissible
            onOdsRemove={() => {
              setMessage({ status: null, label: '' });
            }}
            color={
              message?.status === 'success'
                ? ODS_MESSAGE_COLOR.success
                : ODS_MESSAGE_COLOR.warning
            }
          >
            {message?.label}
          </OdsMessage>
        </div>
      )}
    </React.Suspense>
  );
}
