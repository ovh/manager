import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import OnBoardingPage from './index';
import { createWrapper } from '@/wrapperRenders';
import { useBackups } from '@/data/hooks/useVolumeBackup';
import { TBackup } from '@/data/api/api.types';

vi.mock('@/data/hooks/useVolumeBackup', () => ({
  useBackups: vi.fn(),
}));

describe('OnBoardingPage', () => {
  beforeEach(() => {
    vi.mocked(useBackups).mockReturnValue({
      data: [] as TBackup[],
      isLoading: false,
    } as ReturnType<typeof useBackups>);

    vi.clearAllMocks();
  });

  it('displays the correct title and button label', () => {
    const { container, getByText } = render(<OnBoardingPage />, {
      wrapper: createWrapper(),
    });

    expect(
      getByText('pci_projects_project_storages_volume_backup_onboarding_title'),
    ).toBeVisible();
    expect(
      container.querySelector(
        'ods-button[label="pci_projects_project_storages_volume_backup_onboarding_action_title"]',
      ),
    ).toBeVisible();
  });

  it('renders OnBoardingDescription with the correct translation keys', () => {
    render(<OnBoardingPage />, {
      wrapper: createWrapper(),
    });

    expect(
      screen.getByText(
        'pci_projects_project_storages_volume_backup_onboarding_description_part_1',
      ),
    ).toBeVisible();
    expect(
      screen.getByText(
        'pci_projects_project_storages_volume_backup_onboarding_description_part_2',
      ),
    ).toBeVisible();
  });

  it('renders PciAnnouncementBanner', () => {
    render(<OnBoardingPage />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId('announcement-banner')).toBeInTheDocument();
  });

  it('renders breadcrumb with correct project information', () => {
    const { container } = render(<OnBoardingPage />, {
      wrapper: createWrapper(),
    });

    const breadcrumbItems = container.querySelectorAll('ods-breadcrumb-item');
    expect(container.querySelector('ods-breadcrumb')).toBeVisible();
    expect(breadcrumbItems).toHaveLength(2);
    expect(breadcrumbItems[0].getAttribute('href')).toBe('mockProjectUrl');
    expect(breadcrumbItems[1].getAttribute('label')).toBe(
      'pci_projects_project_storages_volume_backup_onboarding_title',
    );
  });

  it('redirects when backup exist', () => {
    vi.mocked(useBackups).mockReturnValue({
      data: [{ id: '12345678' }] as TBackup[],
      isLoading: false,
    } as ReturnType<typeof useBackups>);

    const { container } = render(<OnBoardingPage />, {
      wrapper: createWrapper(),
    });

    expect(
      container.querySelector(
        "ods-button[label='pci_projects_project_storages_volume_backup_onboarding_action_title']",
      ),
    ).not.toBeInTheDocument();
  });
});
