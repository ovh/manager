import { describe, it } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import React from 'react';
import { labels, renderTestComponent } from '@/test-utils';
import EndpointsListing from './EndpointsListing.page';

describe('EndpointsListing', () => {
  it('should display the endpoints listing', async () => {
    await renderTestComponent({
      nbVs: 2,
      component: <EndpointsListing />,
    });

    await assertTextVisibility(
      labels.endpoints.endpointDatagridManagedServiceURNLabel,
    );
  });
});
