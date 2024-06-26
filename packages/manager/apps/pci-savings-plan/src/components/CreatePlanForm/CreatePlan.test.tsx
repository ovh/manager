import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CreatePlanForm, { CreatePlanFormProps } from './CreatePlanForm';
import { ResourceType, InstanceTechnicalName } from './CreatePlan.type';
import { formatPricingInfo } from '@/utils/formatter/formatter';
import { useTranslation } from 'react-i18next';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn().mockReturnValue({
    t: (key: string) => key,
  }),
}));

const defaultProps: CreatePlanFormProps = {
  instancesInfo: [
    {
      id: '1',
      category: ResourceType.instance,
      technicalName: InstanceTechnicalName.b3,
      label: 'General Purpose',
      technical: [],
    },
  ],
  resources: [
    {
      value: ResourceType.instance,
      label: 'Instance',
      img: 'service.png',
    },
    {
      value: ResourceType.rancher,
      label: 'Rancher',
      img: 'rancher.png',
    },
  ],
  instanceCategory: InstanceTechnicalName.b3,
  setInstanceCategory: vi.fn(),
  pricingByDuration: [
    {
      duration: '1 month',
      price: 100,
    },
  ],
  isPricingLoading: false,
  isTechnicalInfoLoading: false,
  technicalModel: 'b3-8',
  setTechnicalModel: vi.fn(),
};

const setupSpecTest = async (props: CreatePlanFormProps = defaultProps) =>
  waitFor(() => render(<CreatePlanForm {...props} />));

describe('CreatePlanForm', () => {
  it('should render the form with all sections', async () => {
    await setupSpecTest();

    expect(screen.getByText('choose_ressource')).toBeDefined();
    expect(screen.getByText('select_model')).toBeDefined();
    expect(screen.getByText('select_quantity')).toBeDefined();
    expect(screen.getByText('select_commitment')).toBeDefined();
    expect(screen.getByText('choose_name')).toBeDefined();
  });

  it('should allow selecting a resource', async () => {
    await setupSpecTest();

    fireEvent.click(screen.getByText('Instance'));
    expect(defaultProps.setInstanceCategory).toHaveBeenCalledWith(
      InstanceTechnicalName.b3,
    );

    fireEvent.click(screen.getByText('Rancher'));
    expect(defaultProps.setInstanceCategory).toHaveBeenCalledWith(
      InstanceTechnicalName.rancher,
    );
  });

  it('should allow entering a plan name', async () => {
    await setupSpecTest();

    const input = screen.getByPlaceholderText(
      'savings_plan_name_input_placeholder',
    );
    fireEvent.change(input, { target: { value: 'Test Plan' } });
    expect(input).toHaveValue('Test Plan');
  });

  it('should show validation errors when form is submitted without required fields', async () => {
    await setupSpecTest();

    fireEvent.click(screen.getByText('cta_plan'));
    expect(screen.getByText('Plan Name is required')).toBeDefined();
  });

  it('should submit the form with correct data', async () => {
    await setupSpecTest();

    fireEvent.change(
      screen.getByPlaceholderText('savings_plan_name_input_placeholder'),
      { target: { value: 'Test Plan' } },
    );
    fireEvent.click(screen.getByText('legal_checkbox'));
    fireEvent.click(screen.getByText('cta_plan'));

    await waitFor(() => {
      expect(screen.getByText('Plan created successfully')).toBeDefined();
    });
  });
});
