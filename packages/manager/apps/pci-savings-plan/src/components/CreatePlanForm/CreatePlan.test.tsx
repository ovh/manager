import React from 'react';
import { vi, describe, it, expect } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreatePlanForm, { CreatePlanFormProps } from './CreatePlanForm';
import {
  ResourceType,
  InstanceTechnicalName,
} from '../../types/CreatePlan.type';

import { render } from '@/utils/testProvider';

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn().mockReturnValue({
    t: (key: string) => key,
  }),
}));

const mockedUsedNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any),
    useNavigate: () => mockedUsedNavigate,
  };
});

vi.mock('@ovh-ux/manager-pci-common', () => ({
  usePciUrl: vi.fn(() => '/url'),
}));

const mockOnCreatePlan = vi.fn();
const mockSetTechnicalModel = vi.fn();

beforeEach(() => {
  mockOnCreatePlan.mockReset();
  mockSetTechnicalModel.mockReset();
});

const defaultProps: CreatePlanFormProps = {
  isDiscoveryProject: false,
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
      duration: 1,
      id: '1',
      price: 100,
      code: '1',
    },
  ],
  isPricingLoading: false,
  isTechnicalInfoLoading: false,
  technicalModel: 'b3-8',
  setTechnicalModel: mockSetTechnicalModel,
  onCreatePlan: mockOnCreatePlan,
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

  describe('When we want to submit form', () => {
    it('should submit the form with correct data', async () => {
      await setupSpecTest();

      fireEvent.change(
        screen.getByPlaceholderText('savings_plan_name_input_placeholder'),
        { target: { value: 'Test Plan' } },
      );

      // Select duration
      fireEvent.click(screen.getByText('commitment_month'));
      // Select quantity
      const plusButton = screen.getByTestId('plus-button');
      fireEvent.click(plusButton);
      // Select model
      fireEvent.click(screen.getByText('select_model_description_instance_b3'));
      // Accept legal checkbox
      fireEvent.click(screen.getByText('legal_checkbox'));
      // Click on create button
      fireEvent.click(screen.getByText('cta_plan'));

      expect(defaultProps.onCreatePlan).toHaveBeenCalled();
    });

    it('When no instance selected, create button should be disabled ', async () => {
      await setupSpecTest();

      fireEvent.click(screen.getByText('cta_plan'));
      expect(screen.getByText('cta_plan')).toHaveAttribute('disabled');
    });

    it('should not call onCreatePlan if form not valid', async () => {
      await setupSpecTest();

      fireEvent.click(screen.getByText('cta_plan'));

      expect(defaultProps.onCreatePlan).not.toHaveBeenCalled();
    });
  });
});
