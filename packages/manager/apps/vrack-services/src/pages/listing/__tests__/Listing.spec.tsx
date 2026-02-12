import { describe, it } from 'vitest';

import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';

import { labels } from '@/__tests__/test-i18n';
import { renderTestComponent } from '@/__tests__/uiTestHelpers';

import Listing from '../Listing.page';

describe('Vrack Services listing test suite', () => {
  it('should display a listing of vrack services', async () => {
    const { container } = await renderTestComponent({
      component: <Listing />,
      nbVs: 7,
    });

    await assertTextVisibility(labels.listing.listingTitle);
    await assertTextVisibility(labels.listing.displayName);
    await assertTextVisibility(labels.listing.productStatus);
    await assertTextVisibility(labels.listing.region);
    expect(container).toMatchSnapshot();
  });
});
