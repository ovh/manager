import { describe, it } from 'vitest';

import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';

import { labels } from '@/__tests__/test-i18n';
import { renderTestComponent } from '@/__tests__/uiTestHelpers';

import EndpointsListing from '../EndpointsListing.page';

describe('EndpointsListing', () => {
  it('should display the endpoints listing', async () => {
    const { container } = await renderTestComponent({
      nbVs: 2,
      component: <EndpointsListing />,
    });

    await assertTextVisibility(labels.endpoints.endpointDatagridManagedServiceURNLabel);
    expect(container).toMatchSnapshot();
  });
});
