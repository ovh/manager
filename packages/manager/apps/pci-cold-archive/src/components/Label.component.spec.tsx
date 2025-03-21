import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LabelComponent from './Label.component';

describe('LabelComponent', () => {
  it('renders the label text', () => {
    render(<LabelComponent text="Test Label" />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });
});
