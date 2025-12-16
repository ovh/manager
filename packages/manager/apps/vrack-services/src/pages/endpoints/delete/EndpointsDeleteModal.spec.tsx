import { describe, it } from 'vitest';
import React from 'react';
import { assertModalText, labels, renderTestComponent } from '@/test-utils';
import EndpointsDeleteModal from './EndpointDeleteModal.page';

describe('EndpointsDeleteModal', () => {
  it('should display a modal to delete an endpoint', async () => {
    const { container } = await renderTestComponent({
      nbVs: 2,
      component: <EndpointsDeleteModal />,
    });

    await assertModalText({
      container,
      text: labels.endpoints.modalDeleteEndpointDescription,
    });
  });
});
