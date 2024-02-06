import React from 'react';
import userEvent from '@testing-library/user-event';
import EditNameModal from './EditNameModal';
import { render, waitFor } from '../../utils/test/test.provider';
import listingTranslation from '../../public/translations/pci-rancher/listing/Messages_fr_FR.json';
import { rancherMocked } from '../../_mock_/rancher';

const onEditMocked = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

const setupSpecTest = async () =>
  waitFor(() =>
    render(
      <EditNameModal
        rancher={rancherMocked}
        toggleModal={() => true}
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
    const allowedChar = screen.getByText(
      listingTranslation.editNameModaleHelperInput,
    );

    expect(title).not.toBeNull();
    expect(confirmButton).not.toBeNull();
    expect(allowedChar).not.toBeNull();
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

    await userEvent.type(input, '234');
    const NEW_NAME = 'rancher1234';

    // expect(input.getAttribute('value')).toBe(NEW_NAME);

    await userEvent.click(button);

    expect(onEditMocked).toHaveBeenCalledWith({
      ...rancherMocked,
      currentState: {
        ...rancherMocked.currentState,
        name: NEW_NAME,
      },
    });
  });

  it("Given that the name dont respects RegeX, I shouldn't be able to validate .", async () => {
    const screen = await setupSpecTest();

    const input = screen.getByLabelText('edit-input');
    const button = screen.getByText(listingTranslation.editNameRancherCta);

    expect(input).toHaveAttribute('color', 'info');

    await userEvent.type(input, '2:!34()');
    await userEvent.type(input, '()');

    await userEvent.click(button);

    expect(input).toHaveAttribute('color', 'error');

    expect(onEditMocked).not.toHaveBeenCalled();
  });
});
