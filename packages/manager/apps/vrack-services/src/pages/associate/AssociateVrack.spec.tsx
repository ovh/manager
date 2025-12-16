import { describe, it } from 'vitest';
import React from 'react';
import { labels, renderTestComponent, getElementByText } from '@/test-utils';
import AssociateVrackModal from './AssociateVrackModal.page';

describe('Associate Vrack', () => {
  it('should display a small form for associating vrack', async () => {
    // Given / When
    await renderTestComponent({
      component: <AssociateVrackModal />,
      nbVs: 1,
    });

    // Then
    expect(
      await getElementByText({
        value: labels.associate.modalVrackAssociationDescription,
      }),
    ).toBeInTheDocument();
  });

  it('should display a small form for creating vrack when no vrack is available', async () => {
    // Given / When
    await renderTestComponent({
      component: <AssociateVrackModal />,
      nbVs: 1,
      nbEligibleVrackServices: 0,
    });

    // Then
    expect(
      await getElementByText({
        value: labels.createVrack.modalVrackCreationDescriptionLine1,
      }),
    ).toBeInTheDocument();
  });
});
