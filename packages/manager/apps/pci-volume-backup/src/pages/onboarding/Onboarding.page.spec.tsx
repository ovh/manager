import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import OnBoardingPage from './Onboarding.page';
import { createWrapper } from '@/wrapperRenders';
import { useBackups } from '@/data/hooks/useVolumeBackup';
import { TBackup, TApiData } from '@/data/api/api.types';

vi.mock('@/data/hooks/useVolumeBackup', () => ({
  useBackups: vi.fn(),
}));

describe('OnBoardingPage', () => {
  beforeEach(() => {
    vi.mocked(useBackups).mockReturnValue({
      data: { data: [] } as TApiData<TBackup>,
      isLoading: false,
    } as ReturnType<typeof useBackups>);

    vi.clearAllMocks();
  });

  it('displays the correct title and button label', () => {
    const { getAllByText, getByText } = render(<OnBoardingPage />, {
      wrapper: createWrapper(),
    });

    const titles = getAllByText(
      'pci_projects_project_storages_volume_backup_onboarding_title',
    );
    expect(titles).toHaveLength(2);
    expect(titles[0]).toBeVisible();
    expect(titles[1]).toBeVisible();
    expect(
      getByText(
        'pci_projects_project_storages_volume_backup_onboarding_action_title',
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
    render(<OnBoardingPage />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(2);
    expect(breadcrumbItems[0].getAttribute('data-href')).toBe('mockProjectUrl');
    expect(breadcrumbItems[1].getAttribute('data-label')).toBe(
      'pci_projects_project_storages_volume_backup_onboarding_title',
    );
  });

  it('redirects when backup exist', () => {
    vi.mocked(useBackups).mockReturnValue({
      data: { data: [{ id: '12345678' }] } as TApiData<TBackup>,
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
