import React from 'react';
import { apiUrlMocks } from './test.constant';
import { LogsToCustomerModule } from '../LogsToCustomer.module';

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
