import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAllSnapshots } from '@/api/hooks/useSnapshots';
import { TSnapshot } from '@/api/api.types';
import OnBoardingPage from './OnBoarding.page';
import { createWrapper } from '@/wrapperRenders';

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
    const { container, getByText } = render(<OnBoardingPage />, {
      wrapper: createWrapper(),
    });

    expect(
      getByText('pci_projects_project_storages_snapshots_title'),
    ).toBeVisible();
    expect(
      getByText(
        'pci_projects_project_storages_snapshots_onboarding_action_label',
      ),
    ).toBeVisible();
  });

  it('renders OnBoardingDescription with the correct translation keys', () => {
    render(<OnBoardingPage />, {
      wrapper: createWrapper(),
    });

    [...Array(5).keys()].forEach((_key, index) => {
      const textKey = `pci_projects_project_storages_snapshots_onboarding_content${index +
        1}`;
      expect(screen.getByText(textKey)).toBeVisible();
    });

    expect(
      screen
        .getByText(
          'pci_projects_project_storages_snapshots_onboarding_content2',
        )
        .getAttribute('class'),
    ).toBe('fw-bold');
  });

  it('redirects when snapshots exist', () => {
    vi.mocked(useAllSnapshots).mockReturnValue({
      data: [{ id: '12345678' }] as TSnapshot[],
      isLoading: false,
    } as ReturnType<typeof useAllSnapshots>);

    const { container } = render(<OnBoardingPage />, {
      wrapper: createWrapper(),
    });

    expect(
      container.querySelector(
        "ods-button[label='pci_projects_project_storages_snapshots_onboarding_action_label']",
      ),
    ).not.toBeInTheDocument();
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
      'pci_projects_project_storages_snapshots_title',
    );
  });
});
