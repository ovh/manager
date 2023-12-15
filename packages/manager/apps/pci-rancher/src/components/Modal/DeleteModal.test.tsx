import React from 'react';
import DeleteModal from './DeleteModal';
import { render, waitFor } from '../../utils/test.provider';

const setupSpecTest = async () =>
  waitFor(() =>
    render(
      <DeleteModal toggleModal={() => true} onDeleteRancher={() => false} />,
    ),
  );

describe('Delete Modal', () => {
  it('Page should display correctly', async () => {
    const screen = await setupSpecTest();

    const title = screen.getByText('deleteModalTitle');

    expect(title).not.toBeNull();
  });

  describe('Delete Button', () => {
    it('Should be disable', async () => {
      const screen = await setupSpecTest();

      const button = screen.getByText('deleteRancher');

      expect(button).toBeDisabled();
    });
    /* Test Not work with OsdsInput
        it('Should be enabled when TERMINATE is typed', async () => {
            const screen = await setupSpecTest();

            const input = screen.getByLabelText('delete-input')
            const button = screen.getByText('deleteRancher');

            await fireEvent.change(input, { target: { value: TERMINATE_TEXT } });
            expect(screen.getByDisplayValue(TERMINATE_TEXT)).toBeDefined()
            expect(button).toHaveAttribute("disabled", 'false');
        }); */
  });
});
