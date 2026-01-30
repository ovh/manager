import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DomainResellerDashboard from './DomainResellerDashboard';

describe('DomainResellerDashboard', () => {
  it('should render', () => {
    const { container } = render(<DomainResellerDashboard />);
    expect(container).toBeInTheDocument();
  });
});
