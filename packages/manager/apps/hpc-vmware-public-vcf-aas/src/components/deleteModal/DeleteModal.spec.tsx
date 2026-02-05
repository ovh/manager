import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DeleteModal } from './DeleteModal.component';

describe('DeleteModal', () => {
  it('enables primary button when confirmation keyword is entered', async () => {
    const CONFIRMATION_KEYWORD = 'DELETE';
    render(
      <DeleteModal
        isOpen
        heading="Delete resource"
        primaryLabel="Delete"
        secondaryLabel="Cancel"
        confirmationKeyword={CONFIRMATION_KEYWORD}
        onPrimaryButtonClick={() => {}}
        onSecondaryButtonClick={() => {}}
      >
        TOTO
      </DeleteModal>,
    );

    const submitButton = screen.getByTestId('primary-button');

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    const confirmInput = screen.getByPlaceholderText(CONFIRMATION_KEYWORD);

    fireEvent(
      confirmInput,
      new CustomEvent('odsChange', {
        bubbles: true,
        detail: { value: CONFIRMATION_KEYWORD },
      } as CustomEventInit),
    );

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it('enables primary button when no keyword is provided', async () => {
    render(
      <DeleteModal
        isOpen
        heading="Delete resource"
        primaryLabel="Delete"
        secondaryLabel="Cancel"
        onPrimaryButtonClick={() => {}}
        onSecondaryButtonClick={() => {}}
      >
        TOTO
      </DeleteModal>,
    );

    const submitButton = screen.getByTestId('primary-button');

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });
});
