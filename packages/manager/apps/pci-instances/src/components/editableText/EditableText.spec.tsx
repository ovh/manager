import { describe, it, vi, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditableText from './EditableText.component';

const handleValidate = vi.fn();
const value = 'test-text';

const EditableTextComponent = () => (
  <EditableText defaultValue={value} handleValidate={handleValidate} />
);

describe('EditableText Component', () => {
  it('Should display text with pencil', () => {
    render(<EditableTextComponent />);

    expect(screen.getByText(value)).toBeInTheDocument();
    expect(screen.getByTestId('edit-btn')).toBeInTheDocument();
  });

  it('Should display input when on edit mode', async () => {
    render(<EditableTextComponent />);

    userEvent.click(screen.getByTestId('edit-btn'));

    await waitFor(() =>
      expect(screen.getByDisplayValue(value)).toBeInTheDocument(),
    );

    userEvent.click(screen.getByTestId('validate-change'));

    await waitFor(() => expect(handleValidate).toHaveBeenCalled());
  });
});
