import React from 'react';
import userEvent from '@testing-library/user-event';
import DeleteModal, { TERMINATE_TEXT } from './DeleteModal';
import { render, waitFor } from '../../utils/test/test.provider';
import listingTranslation from '../../public/translations/pci-rancher/listing/Messages_fr_FR.json';
import { rancherMocked } from '../../_mock_/rancher';

jest.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigation: jest.fn(() => ({
    getURL: jest.fn(() => Promise.resolve('123')),
    data: [],
  })),
  useTracking: jest.fn(() => ({
    trackPage: jest.fn(),
    trackClick: jest.fn(),
  })),
}));

const onDeleteMocked = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

const setupSpecTest = async () =>
  waitFor(() =>
    render(
      <DeleteModal
        selectedRancher={rancherMocked}
        toggleModal={() => true}
        onDeleteRancher={onDeleteMocked}
      />,
    ),
  );

describe('Delete Modal', () => {
  it('Page should display correctly', async () => {
    const screen = await setupSpecTest();

    const title = screen.getByText(listingTranslation.deleteModalTitle);

    expect(title).not.toBeNull();
  });

  describe('Cancel Button', () => {
    it('should call toggleModal when clicked and close modal', async () => {});
  });

  describe('Delete Button', () => {
    it('Should be disable', async () => {
      const screen = await setupSpecTest();

      const button = screen.getByText(listingTranslation.deleteRancher);

      expect(button).toBeDisabled();
    });

    it('Should be enabled when TERMINATE is typed', async () => {
      const screen = await setupSpecTest();

      const input = screen.getByLabelText('delete-input');
      const button = screen.getByText(listingTranslation.deleteRancher);

      await userEvent.type(input, TERMINATE_TEXT);
      await userEvent.click(button);

      expect(input.getAttribute('value')).toBe(TERMINATE_TEXT);
      expect(button).not.toHaveAttribute('disabled', 'false');

      expect(onDeleteMocked).toHaveBeenCalledWith();
    });
  });
});
