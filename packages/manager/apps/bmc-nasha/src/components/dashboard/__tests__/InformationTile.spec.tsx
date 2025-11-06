import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import type { Nasha } from '@/types/Dashboard.type';

import { InformationTile } from '../InformationTile.component';

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('InformationTile', () => {
  const mockNasha: Nasha = {
    serviceName: 'nasha-test-1',
    customName: 'My Nasha',
    datacenter: 'rbx',
    localeDatacenter: 'Roubaix',
    diskType: 'ssd',
    diskSize: '1000 GB',
    zpoolSize: 1000,
    monitored: true,
    use: {
      size: { value: 1000, unit: 'GB', name: 'Taille' },
      used: { value: 500, unit: 'GB', name: 'Stockage' },
      usedbysnapshots: { value: 100, unit: 'GB', name: 'Snapshots' },
    },
  };

  it('should render information tile with nasha data', () => {
    const onEditName = vi.fn();
    render(<InformationTile nasha={mockNasha} onEditName={onEditName} />);

    expect(screen.getByText('My Nasha')).toBeInTheDocument();
    expect(screen.getByText('nasha-test-1')).toBeInTheDocument();
    expect(screen.getByText('Roubaix')).toBeInTheDocument();
    expect(screen.getByText('ssd')).toBeInTheDocument();
    expect(screen.getByText('1000 GB')).toBeInTheDocument();
  });

  it('should use serviceName when customName is not provided', () => {
    const nashaWithoutCustomName = {
      ...mockNasha,
      customName: undefined,
    };
    const onEditName = vi.fn();

    render(<InformationTile nasha={nashaWithoutCustomName} onEditName={onEditName} />);

    expect(screen.getByText('nasha-test-1')).toBeInTheDocument();
  });

  it('should call onEditName when edit button is clicked', () => {
    const onEditName = vi.fn();
    render(<InformationTile nasha={mockNasha} onEditName={onEditName} />);

    const editButton = screen.getByLabelText('actions.edit');
    fireEvent.click(editButton);

    expect(onEditName).toHaveBeenCalledTimes(1);
  });
});

