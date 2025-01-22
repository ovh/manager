import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LabelComponent from './Label.component';

describe('LabelComponent', () => {
  it('renders the label text', () => {
    render(<LabelComponent text="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders the help text when provided', () => {
    render(
      <LabelComponent
        text="Test Label"
        helpText="Help Text"
        triggerId="help-icon"
      />,
    );
    expect(screen.getByText('Help Text')).toBeInTheDocument();
  });

  it('does not render the help icon when help text is not provided', () => {
    render(<LabelComponent text="Test Label" />);
    expect(
      screen.queryByRole('img', { name: /circle-question/i }),
    ).not.toBeInTheDocument();
  });

  it('applies the provided className', () => {
    render(<LabelComponent text="Test Label" className="custom-class" />);
    expect(screen.getByText('Test Label').parentElement).toHaveClass(
      'custom-class',
    );
  });

  it('uses the default slot value when not provided', () => {
    render(<LabelComponent text="Test Label" />);
    expect(screen.getByText('Test Label').parentElement).toHaveAttribute(
      'slot',
      'label',
    );
  });

  it('uses the provided slot value', () => {
    render(<LabelComponent text="Test Label" slot="custom-slot" />);
    expect(screen.getByText('Test Label').parentElement).toHaveAttribute(
      'slot',
      'custom-slot',
    );
  });
});
