import { TRegion } from '@ovh-ux/manager-react-components';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useProjectRegionDetails } from '@/api/hooks/useRegions';
import { useArchiveRegion } from '@/api/hooks/useArchive';
import Manage from './Manage.page';

vi.mock('@/hooks/useTracking', () => ({
  useTracking: vi.fn(),
}));

vi.mock('@/hooks/useNotifications', () => ({
  useNotifications: vi.fn(),
}));

vi.mock('@/api/hooks/useArchive', () => ({
  useArchiveRegion: vi.fn(),
}));

vi.mock('@/api/hooks/useRegions', () => ({
  useProjectRegionDetails: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ShellContext: React.createContext({
    environment: {
      getUser: () => ({
        ovhSubsidiary: 'FR',
      }),
    },
  }),
}));

describe('Manage', () => {
  const mockNavigate = vi.fn();

  const mockProjectRegionDetails = {
    name: 'BHS',
    services: [
      {
        endpoint: 'http://example.com',
      },
    ],
  } as TRegion;

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useArchiveRegion).mockReturnValue('BHS');

    vi.mocked(useProjectRegionDetails).mockReturnValue({
      data: mockProjectRegionDetails,
      isPending: false,
    } as ReturnType<typeof useProjectRegionDetails>);
  });

  it('should navigate back when cancel button is clicked', () => {
    const { container } = render(<Manage />);

    fireEvent.click(
      container.querySelector(
        'ods-button[label="pci_projects_project_storages_cold_archive_containers_container_manage_close_label"]',
      ),
    );

    expect(mockNavigate).toHaveBeenCalledWith('..');
  });

  it('should match snapshot when data is loaded', () => {
    const { container } = render(<Manage />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when data is loading', () => {
    vi.mocked(useProjectRegionDetails).mockReturnValue({
      data: mockProjectRegionDetails,
      isPending: true,
    } as ReturnType<typeof useProjectRegionDetails>);

    const { container } = render(<Manage />);

    expect(container).toMatchSnapshot();
  });
});
