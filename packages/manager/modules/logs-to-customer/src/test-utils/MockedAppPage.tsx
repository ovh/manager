import React from 'react';

import { LogsToCustomerModule } from '../LogsToCustomer.module';
import { apiUrlMocks } from './test.constant';

export const MockedAppPageLabel = 'mocked app page';

export default function MockedAppPage() {
  return (
    <div>
      <div>{MockedAppPageLabel}</div>
      <LogsToCustomerModule
        logApiVersion="v2"
        logApiUrls={{
          logKind: apiUrlMocks.logKind,
          logSubscription: apiUrlMocks.logSubscription,
          logUrl: apiUrlMocks.logUrl,
        }}
        logIamActions={{ deleteSubscription: [], postSubscription: [] }}
        resourceURN={'urn:test'}
      />
    </div>
  );
}
