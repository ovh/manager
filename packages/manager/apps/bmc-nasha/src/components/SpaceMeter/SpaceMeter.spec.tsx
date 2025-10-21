/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
// import { createOptimalWrapper } from '@ovh-ux/manager-react-components';

import { SpaceMeter } from './SpaceMeter.component';
import type { StorageUsage } from './SpaceMeter.types';

const mockUsage: StorageUsage = {
  size: { value: 100 * 1024 * 1024 * 1024, unit: 'B', name: 'size' },
  used: { value: 25 * 1024 * 1024 * 1024, unit: 'B', name: 'used' },
  usedbysnapshots: { value: 10 * 1024 * 1024 * 1024, unit: 'B', name: 'snapshots' },
};

describe('SpaceMeter', () => {
  it('should display formatted space usage', () => {
    render(<SpaceMeter usage={mockUsage} />);

    expect(screen.getByText(/35.*GB.*used.*\/.*100.*GB/i)).toBeInTheDocument();
  });

  it('should render multi-segment progress bar', () => {
    render(<SpaceMeter usage={mockUsage} />);

    const usedBar = screen.getByTestId('storage-bar-used');
    expect(usedBar).toHaveStyle({ width: '25%' });

    const snapshotsBar = screen.getByTestId('storage-bar-snapshots');
    expect(snapshotsBar).toHaveStyle({ width: '10%' });
  });

  it('should display help popover when help is enabled', () => {
    render(<SpaceMeter usage={mockUsage} help={true} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should display legend when enabled', () => {
    render(<SpaceMeter usage={mockUsage} legend={true} />);

    expect(screen.getByText('Données')).toBeInTheDocument();
    expect(screen.getByText('Snapshots')).toBeInTheDocument();
  });

  it('should handle large variant', () => {
    render(<SpaceMeter usage={mockUsage} large={true} />);

    const progressBar = screen.getByTestId('storage-bar-used').parentElement;
    expect(progressBar).toHaveClass('h-[18px]');
  });
});
