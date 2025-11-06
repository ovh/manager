import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import type { NashaUse } from '@/types/Dashboard.type';

import { SpaceMeter } from '../SpaceMeter.component';

describe('SpaceMeter', () => {
  const mockUsage: NashaUse = {
    size: { value: 1000, unit: 'GB', name: 'Taille' },
    used: { value: 500, unit: 'GB', name: 'Stockage' },
    usedbysnapshots: { value: 100, unit: 'GB', name: 'Snapshots' },
  };

  it('should render space meter with usage data', () => {
    render(<SpaceMeter usage={mockUsage} />);

    expect(screen.getByText(/500 GB \/ 1000 GB/)).toBeInTheDocument();
    expect(screen.getByText(/50\.00%/)).toBeInTheDocument();
  });

  it('should render with legend when legend prop is true', () => {
    render(<SpaceMeter usage={mockUsage} legend />);

    expect(screen.getByText(/Stockage:/)).toBeInTheDocument();
    expect(screen.getByText(/Snapshots:/)).toBeInTheDocument();
  });

  it('should not render legend when legend prop is false', () => {
    render(<SpaceMeter usage={mockUsage} legend={false} />);

    expect(screen.queryByText(/Stockage:/)).not.toBeInTheDocument();
  });

  it('should return null when size value is missing', () => {
    const invalidUsage = {
      ...mockUsage,
      size: { value: 0, unit: 'GB', name: 'Taille' },
    };

    const { container } = render(<SpaceMeter usage={invalidUsage} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render help tooltip when help prop is provided', () => {
    const helpText = 'This is a help message';
    render(<SpaceMeter usage={mockUsage} help={helpText} />);

    const helpButton = screen.getByRole('button');
    expect(helpButton).toBeInTheDocument();
    expect(helpButton).toHaveAttribute('data-oui-popover', helpText);
  });
});

