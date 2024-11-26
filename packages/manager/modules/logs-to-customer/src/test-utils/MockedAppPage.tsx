import React from 'react';
import LogsToCustomerModule from '@ovh-ux/logs-to-customer/src/LogsToCustomer.module';
import { testLogUrl } from './test.constant';

export const MockedAppPageLabel = 'mocked app page';

export default function MockedAppPage() {
  return (
    <div>
      <div>{MockedAppPageLabel}</div>
      <LogsToCustomerModule
        logApiVersion="v2"
        logApiUrls={{
          logKind: testLogUrl,
          logSubscription: testLogUrl,
          logUrl: testLogUrl,
        }}
      />
    </div>
  );
}
