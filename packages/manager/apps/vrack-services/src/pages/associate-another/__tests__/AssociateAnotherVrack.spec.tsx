import React from 'react';

import { describe, it } from 'vitest';

import { labels } from '@/__tests__/test-i18n';
import { getElementByText, renderTestComponent } from '@/__tests__/uiTestHelpers';

import AssociateAnotherVrackModal from '../AssociateAnotherVrackModal.page';

describe('AssociateAnotherVrack', () => {
  it('Should display a small form', async () => {
    // Given / When
    await renderTestComponent({
      component: <AssociateAnotherVrackModal />,
      nbVs: 5,
      nbVrack: 2,
    });

    // Then
    expect(
      await getElementByText({
        value: labels.associate.modalAssociateAnotherVrackDescription,
      }),
    ).toBeInTheDocument();
    expect(
      await getElementByText({
        value: labels.associate.modalAssociateAnotherVrackSelect,
      }),
    ).toBeInTheDocument();
    expect(
      await getElementByText({
        value: labels.associate.modalConfirmVrackAssociationButtonLabel,
      }),
    ).toBeInTheDocument();
    expect(await getElementByText({ value: labels.actions.cancel })).toBeInTheDocument();
  });
});
