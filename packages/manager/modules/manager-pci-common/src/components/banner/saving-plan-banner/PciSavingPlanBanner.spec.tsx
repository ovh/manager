import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, Mock, vi } from 'vitest';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import PciSavingPlanBanner from './PciSavingPlanBanner';

const mockNavigateTo = vi.fn();
vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigation: () => ({
    navigateTo: mockNavigateTo,
  }),
}));

describe('PciSavingPlanBanner tests', () => {
  it('should render the banner with the correct message and CTA', () => {
    const { container } = render(
      <PciSavingPlanBanner className="test-class" />,
    );

    expect(
      screen.getByText('pci_projects_project_activate_project_banner_message'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('pci_projects_project_activate_project_banner_cta'),
    ).toBeInTheDocument();

    expect(container.querySelector('.test-class')).toBeInTheDocument();
  });

  it('should call navigateToSavingsPlan on CTA click', async () => {
    render(<PciSavingPlanBanner className="test-class" />);

    const ctaButton = screen.getByText(
      'pci_projects_project_activate_project_banner_cta',
    );

    fireEvent.click(ctaButton);

    expect(mockNavigateTo).toHaveBeenCalledWith(
      'public-cloud',
      `#/pci/projects/mockProjectUrl/savings-plan`,
      {},
    );
  });
});
