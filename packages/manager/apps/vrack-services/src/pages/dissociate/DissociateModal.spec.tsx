import { describe, it } from 'vitest';
import React from 'react';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { labels, renderTestComponent } from '@/test-utils';
import DissociateModal from './DissociateModal.page';

describe('Vrack Services dissociate vrack test suite', () => {
  it('should dispaly a modal to dissociate vrack', async () => {
    await renderTestComponent({
      component: <DissociateModal />,
    });

    await assertTextVisibility(labels.dissociate.modalDissociateHeadline);
  });
});
