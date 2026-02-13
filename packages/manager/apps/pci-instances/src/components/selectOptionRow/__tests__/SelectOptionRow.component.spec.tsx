import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SelectOptionRow from '../SelectOptionRow.component';

describe('SelectOptionRow', () => {
  it('should display the text', () => {
    render(<SelectOptionRow label="Some label" />);

    expect(screen.getByText('Some label')).toBeInTheDocument();
  });

  it('should display the badge when badge prop is defined', () => {
    render(<SelectOptionRow label="With badge" badge="Badge text" />);

    expect(screen.getByText('With badge')).toBeVisible();
    expect(screen.getByText('Badge text')).toBeVisible();
  });

  it('should not display a badge when badge prop is not defined', () => {
    render(<SelectOptionRow label="No badge" />);

    expect(screen.getByText('No badge')).toBeVisible();
    expect(screen.queryByText('Badge text')).not.toBeInTheDocument();
  });
});
