import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DomainResellerDashboard from './DomainResellerDashboard';

describe('DomainResellerDashboard', () => {
  it('should render the dashboard page', () => {
    render(<DomainResellerDashboard />);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });
});
