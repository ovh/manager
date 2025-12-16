import { describe, it } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import React from 'react';
import { labels, renderTestComponent } from '@/test-utils';
import Listing from './Listing.page';

describe('Vrack Services listing test suite', () => {
  it('should display a listing of vrack services', async () => {
    await renderTestComponent({
      component: <Listing />,
      nbVs: 7,
    });

    await assertTextVisibility(labels.listing.listingTitle);
    await assertTextVisibility(labels.listing.displayName);
    await assertTextVisibility(labels.listing.productStatus);
    await assertTextVisibility(labels.listing.region);
  });
});
