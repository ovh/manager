import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LabelComponent from './Label.component';

describe('LabelComponent', () => {
  it('renders the label text', () => {
    const { getByText } = render(<LabelComponent text="Test Label" />);
    expect(getByText('Test Label')).toBeInTheDocument();
  });

  it('renders the help text when provided', () => {
    const { getByText } = render(
      <LabelComponent text="Test Label" helpText="Help Text" />,
    );
    expect(getByText('Help Text')).toBeInTheDocument();
  });

  it('does not render the help text when not provided', () => {
    const { queryByText } = render(<LabelComponent text="Test Label" />);
    expect(queryByText('Help Text')).not.toBeInTheDocument();
  });

  it('applies error color when hasError is true', () => {
    const { getByText } = render(<LabelComponent text="Test Label" hasError />);
    const label = getByText('Test Label');
    expect(label).toHaveAttribute('color', 'error');
  });

  it('applies custom className when provided', () => {
    const { getByText } = render(
      <LabelComponent text="Test Label" className="custom-class" />,
    );

    const { parentElement } = getByText('Test Label');
    expect(parentElement).toHaveClass('custom-class');
  });
});
