import React from 'react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import listingTranslation from '@translation/listing/Messages_fr_FR.json';
import DeleteModal, { TERMINATE_TEXT } from './DeleteModal.component';
import { fireEvent, render, waitFor, act } from '@/utils/test/test.provider';
import { rancherMocked } from '@/_mock_/rancher';

const onDeleteMocked = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
});

const setupSpecTest = async () =>
  waitFor(() =>
    render(
      <DeleteModal
        selectedRancher={rancherMocked}
        onClose={() => true}
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

      await act(async () => {
        fireEvent.change(input, { target: { value: TERMINATE_TEXT } });
      });

      await userEvent.click(button);

      expect(input.getAttribute('value')).toBe(TERMINATE_TEXT);
      expect(button).not.toHaveAttribute('disabled', 'false');

      expect(onDeleteMocked).toHaveBeenCalledWith();
    });
  });
});
