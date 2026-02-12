import { screen } from '@testing-library/react';
import { describe, it } from 'vitest';

import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';

import { labels } from '@/__tests__/test-i18n';
import { renderTestComponent } from '@/__tests__/uiTestHelpers';

import DissociateModal from '../DissociateModal.page';

describe('Vrack Services dissociate vrack test suite', () => {
  it('should display a modal to dissociate vrack', async () => {
    await renderTestComponent({
      component: <DissociateModal />,
    });

    await assertTextVisibility(labels.dissociate.modalDissociateHeadline);
    expect(screen.getByText(labels.dissociate.modalDissociateDescription)).toBeVisible();
  });
});
