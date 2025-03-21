import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAllSnapshots } from '@/api/hooks/useSnapshots';
import { TSnapshot } from '@/api/data/snapshots';
import OnBoardingPage from './Onboarding.page';

vi.mock('@/api/hooks/useSnapshots', () => ({
  useAllSnapshots: vi.fn(),
}));

describe('OnBoardingPage', () => {
  beforeEach(() => {
    vi.mocked(useAllSnapshots).mockReturnValue({
      data: [] as TSnapshot[],
      isLoading: false,
    } as ReturnType<typeof useAllSnapshots>);
  });

  it('displays the correct title and button label', () => {
    const { container } = render(<OnBoardingPage />);

    expect(
      screen.getByText('pci_projects_project_storages_snapshots_title'),
    ).toBeVisible();
    expect(
      container.querySelector(
        "ods-button[label='pci_projects_project_storages_snapshots_onboarding_action_label']",
      ),
    ).toBeVisible();
  });

  it('renders OnBoardingDescription with the correct translation keys', () => {
    render(<OnBoardingPage />);

    expect(
      screen.getByText(
        'pci_projects_project_storages_snapshots_onboarding_content1',
      ),
    ).toBeVisible();
    expect(
      screen.getByText(
        'pci_projects_project_storages_snapshots_onboarding_content2',
      ),
    ).toBeVisible();
    expect(
      screen.getByText(
        'pci_projects_project_storages_snapshots_onboarding_content3',
      ),
    ).toBeVisible();
    expect(
      screen.getByText(
        'pci_projects_project_storages_snapshots_onboarding_content4',
      ),
    ).toBeVisible();
    expect(
      screen.getByText(
        'pci_projects_project_storages_snapshots_onboarding_content5',
      ),
    ).toBeVisible();

    expect(
      screen
        .getByText(
          'pci_projects_project_storages_snapshots_onboarding_content2',
        )
        .getAttribute('class'),
    ).toBe('fw-bold');
  });

  it('navigates to the correct URL when order button is clicked', async () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    });

    const { container } = render(<OnBoardingPage />);

    const orderButton = container.querySelector(
      "ods-button[label='pci_projects_project_storages_snapshots_onboarding_action_label']",
    );

    await userEvent.click(orderButton as HTMLElement);

    expect(window.location.href).toBe('mockProjectUrl/storages/blocks');
  });

  it('redirects when snapshots exist', () => {
    vi.mocked(useAllSnapshots).mockReturnValue({
      data: [{ id: '12345678' }] as TSnapshot[],
      isLoading: false,
    } as ReturnType<typeof useAllSnapshots>);

    const { container } = render(<OnBoardingPage />);

    expect(
      container.querySelector(
        "ods-button[label='pci_projects_project_storages_snapshots_onboarding_action_label']",
      ),
    ).not.toBeInTheDocument();
  });

  it('renders PciAnnouncementBanner', () => {
    render(<OnBoardingPage />);

    expect(screen.getByTestId('pci-announcement-banner')).toBeInTheDocument();
  });

  it('renders breadcrumb with correct project information', () => {
    const { container } = render(<OnBoardingPage />);

    const breadcrumbItems = container.querySelectorAll('ods-breadcrumb-item');
    expect(container.querySelector('ods-breadcrumb')).toBeVisible();
    expect(breadcrumbItems).toHaveLength(2);
    expect(breadcrumbItems[0].getAttribute('href')).toBe('mockProjectUrl');
    expect(breadcrumbItems[1].getAttribute('label')).toBe(
      'pci_projects_project_storages_snapshots_title',
    );
  });
});
