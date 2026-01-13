import { screen } from '@testing-library/react';
import { describe, it } from 'vitest';

import { labels } from '@/__tests__/test-i18n';
import { assertModalText, renderTestComponent } from '@/__tests__/uiTestHelpers';

import EndpointsDeleteModal from '../EndpointDeleteModal.page';

describe('EndpointsDeleteModal', () => {
  it('should display a modal to delete an endpoint', async () => {
    await renderTestComponent({
      nbVs: 2,
      component: <EndpointsDeleteModal />,
    });

    await assertModalText(labels.endpoints.modalDeleteEndpointDescription);
    expect(screen.getByText(labels.endpoints.modalDeleteServiceEndpointHeadline)).toBeVisible();
  });
});
