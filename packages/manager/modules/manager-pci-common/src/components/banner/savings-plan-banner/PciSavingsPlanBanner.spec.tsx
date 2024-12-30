import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import PciSavingPlanBanner from './PciSavingsPlanBanner';

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
      screen.getByText('pci_projects_savings_plan_banner'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('pci_projects_savings_plan_cta'),
    ).toBeInTheDocument();

    expect(container.querySelector('.test-class')).toBeInTheDocument();
  });

  it('should call navigateToSavingsPlan on CTA click', async () => {
    render(<PciSavingPlanBanner className="test-class" />);

    const ctaButton = screen.getByText('pci_projects_savings_plan_cta');

    fireEvent.click(ctaButton);

    expect(mockNavigateTo).toHaveBeenCalledWith(
      'public-cloud',
      `#/pci/projects/mockProjectUrl/savings-plan`,
      {},
    );
  });
});
