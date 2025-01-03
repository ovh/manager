import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  ShellContextType,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import { describe, it, vi } from 'vitest';
import PciSavingsPlanBanner from './PciSavingsPlanBanner';
import { wrapper } from '@/wrapperRenders';

const mockNavigateTo = vi.fn();

const mockShellContext = {
  shell: {
    navigation: {
      navigateTo: mockNavigateTo,
    },
  },
};

describe('PciSavingPlanBanner tests', () => {
  it('should render the banner with the correct message and CTA', () => {
    const {
      container,
    } = render(<PciSavingsPlanBanner className="test-class" />, { wrapper });

    expect(
      screen.getByText('pci_projects_savings_plan_banner'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('pci_projects_savings_plan_cta'),
    ).toBeInTheDocument();

    expect(container.querySelector('.test-class')).toBeInTheDocument();
  });

  it('should call navigateToSavingsPlan on CTA click', async () => {
    render(
      <ShellContext.Provider
        value={(mockShellContext as unknown) as ShellContextType}
      >
        <PciSavingsPlanBanner className="test-class" />
      </ShellContext.Provider>,
    );

    const ctaButton = screen.getByText('pci_projects_savings_plan_cta');

    fireEvent.click(ctaButton);

    expect(mockNavigateTo).toHaveBeenCalledWith(
      'public-cloud',
      `#/pci/projects/mockProjectUrl/savings-plan`,
      {},
    );
  });
});
