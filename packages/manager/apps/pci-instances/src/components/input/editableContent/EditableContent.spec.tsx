import { describe, it, vi, expect } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditableContent from './EditableContent.component';

const handleValidate = vi.fn();
const value = 'test-text';

describe('EditableText Component', () => {
  it('Should display text with pencil', () => {
    render(<EditableContent defaultValue={value} onSubmit={handleValidate} />);

    expect(screen.getByText(value)).toBeInTheDocument();
    expect(screen.getByLabelText('Edit')).toBeInTheDocument();
  });

  it('Should display input when on edit mode', async () => {
    render(
      <EditableContent
        defaultValue={value}
        onSubmit={handleValidate}
        aria-label="LabelForText"
      />,
    );

    await act(() => userEvent.click(screen.getByLabelText('Edit')));

    const input = screen.getByDisplayValue(value);
    expect(input).toBeInTheDocument();

    fireEvent.change(screen.getByRole('textbox', { name: 'LabelForText' }), {
      target: { value: 'new_text' },
    });
    await act(() => userEvent.click(screen.getByLabelText('Submit')));

    await waitFor(() => expect(handleValidate).toHaveBeenCalled());
    expect(input).not.toBeInTheDocument();
    expect(screen.getByText('new_text')).toBeInTheDocument();
  });
});
