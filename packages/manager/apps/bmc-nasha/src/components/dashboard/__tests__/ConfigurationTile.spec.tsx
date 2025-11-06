import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';

import type { Nasha } from '@/types/Dashboard.type';

import { ConfigurationTile } from '../ConfigurationTile.component';
import { goToPartitionsCreate } from '@/utils/dashboard/navigation.utils';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('@/utils/dashboard/navigation.utils', () => ({
  goToPartitionsCreate: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('ConfigurationTile', () => {
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

  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it('should render configuration tile with space meter', () => {
    render(
      <ConfigurationTile
        nasha={mockNasha}
        canCreatePartitions={true}
        serviceName={mockNasha.serviceName}
      />,
    );

    expect(screen.getByText('configuration.title')).toBeInTheDocument();
    expect(screen.getByText('configuration.quota')).toBeInTheDocument();
  });

  it('should call goToPartitionsCreate when button is clicked', () => {
    render(
      <ConfigurationTile
        nasha={mockNasha}
        canCreatePartitions={true}
        serviceName={mockNasha.serviceName}
      />,
    );

    const button = screen.getByText('configuration.link');
    fireEvent.click(button);

    expect(goToPartitionsCreate).toHaveBeenCalledWith(mockNasha.serviceName, mockNavigate);
  });

  it('should disable button when cannot create partitions', () => {
    render(
      <ConfigurationTile
        nasha={mockNasha}
        canCreatePartitions={false}
        serviceName={mockNasha.serviceName}
      />,
    );

    const button = screen.getByText('configuration.link');
    expect(button.closest('button')).toBeDisabled();
  });
});

