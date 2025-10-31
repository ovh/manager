import { it, vi, describe, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SupportLink } from './index';

describe('SupportLink.component', () => {
  it('should render', () => {
    render(<SupportLink />);
    expect(screen.getByTestId('support-link')).toBeInTheDocument();
  });

  it('should have correct attributes', () => {
    render(<SupportLink />);

    const supportLink = screen.getByTestId('support-link');

    expect(supportLink).toHaveAttribute('target', '_blank');
    expect(supportLink).toHaveAttribute('rel', 'noopener');
  });
});
