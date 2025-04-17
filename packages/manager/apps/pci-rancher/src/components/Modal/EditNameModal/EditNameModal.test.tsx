import React from 'react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import listingTranslation from '@translation/listing/Messages_fr_FR.json';
import EditNameModal from './EditNameModal.component';
import { fireEvent, render, waitFor, act } from '@/utils/test/test.provider';
import { rancherMocked } from '@/_mock_/rancher';

const onEditMocked = vi.fn();
const onClose = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
});

const setupSpecTest = async () =>
  waitFor(() =>
    render(
      <EditNameModal
        onClose={onClose}
        rancher={rancherMocked}
        onEditRancher={onEditMocked}
      />,
    ),
  );

describe('Edit Name Modal', () => {
  it('I should see the title, confirm button and allowed characters', async () => {
    const screen = await setupSpecTest();

    const title = screen.getByText(listingTranslation.editNameModalTitle);
    const confirmButton = screen.getByText(
      listingTranslation.editNameRancherCta,
    );

    // Text is broken on multiline, so we need to use getAllByText
    const allowedChar = screen.getAllByText(
      (_, element) =>
        element.textContent === listingTranslation.editNameModaleHelperInput,
    );
    expect(allowedChar[0]).not.toBeNull();

    expect(title).not.toBeNull();
    expect(confirmButton).not.toBeNull();
  });

  it("Given that the name doesn't change, the CTA should be disabled", async () => {
    const screen = await setupSpecTest();

    const button = screen.getByText(listingTranslation.editNameRancherCta);

    expect(button).toBeDisabled();
  });

  it("Given that I'm on the modale, I should be able to write another name in the box and click on the CTA to validate my change.", async () => {
    const screen = await setupSpecTest();

    const input = screen.getByLabelText('edit-input');
    const button = screen.getByText(listingTranslation.editNameRancherCta);
    const NEW_NAME = 'rancher1234';

    await act(async () => {
      fireEvent.change(input, { target: { value: NEW_NAME } });
    });

    await userEvent.click(button);

    expect(onEditMocked).toHaveBeenCalledWith({
      ...rancherMocked,
      targetSpec: {
        ...rancherMocked.targetSpec,
        name: NEW_NAME,
      },
    });
  });

  it("Given that the name dont respects RegeX, I shouldn't be able to validate .", async () => {
    const screen = await setupSpecTest();

    const input = screen.getByLabelText('edit-input');
    const button = screen.getByText(listingTranslation.editNameRancherCta);

    expect(input).toHaveAttribute('color', 'info');

    await act(async () => {
      fireEvent.change(input, { target: { value: '12()34343:::' } });
    });

    await userEvent.click(button);

    expect(input).toHaveAttribute('color', 'error');

    expect(onEditMocked).not.toHaveBeenCalled();
  });
});
