import { describe, it } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import React from 'react';
import { labels, renderTestComponent } from '@/test-utils';
import CreateVrackServicesPage from './CreateVrackServices.page';

describe('Vrack Services create page test suite', () => {
  it('should display the create form with regions', async () => {
    await renderTestComponent({
      component: <CreateVrackServicesPage />,
    });

    await assertTextVisibility(labels.create.regionLabel);
    await assertTextVisibility(labels.create.regionDescription);
  });
});
