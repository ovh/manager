import React from 'react';
import userEvent from '@testing-library/user-event';
import DeleteModal, { TERMINATE_TEXT } from './DeleteModal';
import { render, waitFor } from '../../utils/test.provider';
import { RancherService } from '@/api/api.type';
import listingTranslation from '@/public/translations/pci-rancher/listing/Messages_fr_FR.json';
import { rancherMocked } from '@/_mock_/rancher';

const onDeleteMocked = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

const setupSpecTest = async () =>
  waitFor(() =>
    render(
      <DeleteModal
        selectedRancher={
          {
            id: '123',
          } as RancherService
        }
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
      expect(button).toHaveAttribute('disabled', 'false');

      expect(onDeleteMocked).toHaveBeenCalledWith(rancherMocked.id);
    });
  });
});
