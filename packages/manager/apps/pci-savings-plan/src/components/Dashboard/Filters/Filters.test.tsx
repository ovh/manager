import React from 'react';
import { vi } from 'vitest';

import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Filters from './Filters';
import { ResourceType } from '@/types/CreatePlan.type';
import { SavingsPlanService, SavingsPlanPlanedChangeStatus } from '@/types';
import { render } from '@/utils/testProvider';

// Mock the translation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const instanceSavingsPlan: SavingsPlanService[] = [
  {
    flavor: 'b3-8',
    periodEndAction: SavingsPlanPlanedChangeStatus.REACTIVATE,
  },
  {
    flavor: 'c3-16',
    periodEndAction: SavingsPlanPlanedChangeStatus.REACTIVATE,
  },
] as SavingsPlanService[];

const rancherSavigsPlan: SavingsPlanService[] = [
  {
    flavor: 'Rancher',
    periodEndAction: SavingsPlanPlanedChangeStatus.REACTIVATE,
  },
] as SavingsPlanService[];
// Mock data
const mockSavingsPlans: SavingsPlanService[] = [
  ...instanceSavingsPlan,
  ...rancherSavigsPlan,
] as SavingsPlanService[];

describe('Filters Component', () => {
  describe('Service Filter', () => {
    it('should render service options based on savings plans', () => {
      render(
        <Filters
          defaultFilter={mockSavingsPlans[0]}
          savingsPlan={mockSavingsPlans}
          locale="en-US"
        />,
      );

      const resourceSelect = screen.getByLabelText(
        'dashboard_select_label_resource',
      );
      expect(resourceSelect).toBeInTheDocument();

      fireEvent.click(resourceSelect);
      expect(screen.getByText('resource_tabs_instance')).toBeInTheDocument();
      expect(screen.getByText('resource_tabs_rancher')).toBeInTheDocument();
    });

    it('should not display rancher if there is no rancher savings plan', () => {
      render(
        <Filters
          defaultFilter={mockSavingsPlans[0]}
          savingsPlan={instanceSavingsPlan}
          locale="en-US"
        />,
      );
      const resourceSelect = screen.getByLabelText(
        'dashboard_select_label_resource',
      );
      fireEvent.click(resourceSelect);
      expect(
        screen.queryByText('resource_tabs_rancher'),
      ).not.toBeInTheDocument();
    });
  });

  it('should render instance range options when "Instance" is selected', () => {
    render(
      <Filters
        defaultFilter={mockSavingsPlans[0]}
        savingsPlan={mockSavingsPlans}
        locale="en-US"
      />,
    );

    const resourceSelect = screen.getByLabelText(
      'dashboard_select_label_resource',
    );
    fireEvent.change(resourceSelect, {
      target: { value: ResourceType.instance },
    });

    const flavorSelect = screen.getByLabelText('dashboard_select_label_flavor');
    fireEvent.click(flavorSelect);

    expect(
      screen.getByText('create:resource_tabs_general_purpose'),
    ).toBeInTheDocument();
    expect(screen.getByText('create:resource_tabs_cpu')).toBeInTheDocument();
  });

  it('should render rancher option when "Rancher" is selected', () => {
    render(
      <Filters
        defaultFilter={mockSavingsPlans[2]}
        savingsPlan={mockSavingsPlans}
        locale="en-US"
      />,
    );

    const resourceSelect = screen.getByLabelText(
      'dashboard_select_label_resource',
    );
    fireEvent.change(resourceSelect, {
      target: { value: ResourceType.rancher },
    });

    const flavorSelect = screen.getByLabelText('dashboard_select_label_flavor');
    fireEvent.click(flavorSelect);

    expect(screen.getByText('resource_tabs_rancher')).toBeInTheDocument();
  });

  it('should render model options based on selected flavor', () => {
    render(
      <Filters
        defaultFilter={mockSavingsPlans[0]}
        savingsPlan={mockSavingsPlans}
        locale="en-US"
      />,
    );

    const flavorSelect = screen.getByLabelText('dashboard_select_label_flavor');
    fireEvent.change(flavorSelect, { target: { value: 'b3-8' } });

    const modelSelect = screen.getByLabelText('dashboard_select_label_model');
    fireEvent.click(modelSelect);

    expect(screen.getByText('b3-8')).toBeInTheDocument();
  });

  it('should render period options', () => {
    render(
      <Filters
        defaultFilter={mockSavingsPlans[0]}
        savingsPlan={mockSavingsPlans}
        locale="en-US"
      />,
    );

    const periodSelect = screen.getByLabelText('dashboard_select_label_period');
    fireEvent.click(periodSelect);

    const currentMonth = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(new Date());

    expect(screen.getByText(currentMonth)).toBeInTheDocument();
  });
});
