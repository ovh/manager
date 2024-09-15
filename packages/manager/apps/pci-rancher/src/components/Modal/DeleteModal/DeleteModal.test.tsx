import React from 'react';
import userEvent from '@testing-library/user-event';
import { describe, it, vi } from 'vitest';
import { waitFor, act, fireEvent, screen } from '@testing-library/react';
import listingTranslation from '../../../../public/translations/listing/Messages_fr_FR.json';
import DeleteModal, { TERMINATE_TEXT } from './DeleteModal.component';
import { render } from '../../../utils/test/test.provider';
import { rancherMocked } from '../../../_mock_/rancher';

const onDeleteMocked = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
});

vi.mock('react-use', () => ({
  useMedia: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigation: vi.fn(() => ({
    getURL: vi.fn(() => Promise.resolve('123')),
    data: [],
  })),
  useTracking: vi.fn(() => ({
    trackPage: vi.fn(),
    trackClick: vi.fn(),
  })),
}));

const setupSpecTest = () =>
  render(
    <DeleteModal
      selectedRancher={rancherMocked}
      onClose={() => true}
      onDeleteRancher={onDeleteMocked}
    />,
  );

describe('Delete Modal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('Page should display correctly', async () => {
    setupSpecTest();

    const title = screen.getByText(listingTranslation.deleteModalTitle);

    expect(title).not.toBeNull();
  });

  describe('Cancel Button', () => {
    it('should call toggleModal when clicked and close modal', async () => {});
  });

  describe('Delete Button', () => {
    it('Should be disable', async () => {
      setupSpecTest();

      const button = screen.getByText(listingTranslation.deleteRancher);

      expect(button).toBeDisabled();
    });

    it('Should be enabled when TERMINATE is typed', async () => {
      setupSpecTest();

      const input = screen.getByLabelText('delete-input');
      const button = screen.getByText(listingTranslation.deleteRancher);

      act(async () => {
        await fireEvent.change(input, { target: { value: TERMINATE_TEXT } });
      });

      act(async () => {
        await userEvent.click(button);
      });

      waitFor(() => {
        expect(input.getAttribute('value')).toBe(TERMINATE_TEXT);
        expect(button).not.toHaveAttribute('disabled', 'false');
        expect(onDeleteMocked).toHaveBeenCalledWith();
      });
    });
  });
});
