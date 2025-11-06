import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { useMe } from '@ovh-ux/manager-react-components';

import type { Nasha } from '@/types/Dashboard.type';

import { DashboardHeader } from '../DashboardHeader.component';

// Mock dependencies
vi.mock('@ovh-ux/manager-react-components', () => ({
  useMe: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('DashboardHeader', () => {
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

  const mockNashaApiUrl = '/dedicated/nasha/nasha-test-1';
  const onReload = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useMe).mockReturnValue({
      me: {
        ovhSubsidiary: 'FR',
      },
    } as any);
  });

  it('should render header with custom name', () => {
    render(
      <DashboardHeader
        nasha={mockNasha}
        nashaApiUrl={mockNashaApiUrl}
        onReload={onReload}
      />,
    );

    expect(screen.getByText('My Nasha')).toBeInTheDocument();
    expect(screen.getByText('nasha-test-1')).toBeInTheDocument();
  });

  it('should render header with serviceName when customName is not provided', () => {
    const nashaWithoutCustomName = {
      ...mockNasha,
      customName: undefined,
    };

    render(
      <DashboardHeader
        nasha={nashaWithoutCustomName}
        nashaApiUrl={mockNashaApiUrl}
        onReload={onReload}
      />,
    );

    expect(screen.getByText('nasha-test-1')).toBeInTheDocument();
  });

  it('should open edit modal when edit button is clicked', () => {
    render(
      <DashboardHeader
        nasha={mockNasha}
        nashaApiUrl={mockNashaApiUrl}
        onReload={onReload}
      />,
    );

    const editButton = screen.getByLabelText('actions.edit');
    fireEvent.click(editButton);

    // Modal should be rendered (check for modal content)
    expect(screen.getByText(/edit_name.title/)).toBeInTheDocument();
  });
});

