import { describe, it } from 'vitest';

import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';

import { labels } from '@/__tests__/test-i18n';
import { renderTestComponent } from '@/__tests__/uiTestHelpers';

import CreateVrackServicesPage from '../CreateVrackServices.page';

describe('Vrack Services create page test suite', () => {
  it('should display the create form with regions', async () => {
    const { container } = await renderTestComponent({
      component: <CreateVrackServicesPage />,
    });

    await assertTextVisibility(labels.create.regionLabel);
    await assertTextVisibility(labels.create.regionDescription);
    expect(container).toMatchSnapshot();
  });
});
