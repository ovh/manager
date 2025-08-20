import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { UseQueryResult } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createWrapper } from '@/wrapperRenders';
import { CartSummary } from '@/data/types/cart.type';
import { useGetCartSummary } from '@/data/hooks/useCart';
import { useHdsManagement } from '../hooks/useHdsManagement';
import ConfigStep, { ConfigStepProps } from './ConfigStep';

vi.mock('@/data/hooks/useCart', () => ({
  useGetCartSummary: vi.fn(),
}));

vi.mock('../hooks/useHdsManagement', () => ({
  useHdsManagement: vi.fn(),
}));

describe('ConfigStep', () => {
  const mockSetForm = vi.fn();

  const defaultProps: ConfigStepProps = {
    cart: {
      cartId: 'cart-123',
      description: 'Test cart',
      expire: '2024-12-31T23:59:59Z',
      readonly: false,
      prices: {
        withTax: {
          value: 100,
        },
      },
      url: 'https://example.com/cart',
    },
    cartProjectItem: {
      cartId: 'cart-123',
      itemId: 456,
      productId: 'project-product',
      configuration: [],
      duration: 'P1M',
      options: [],
      prices: [],
      settings: {
        planCode: 'project.2018',
        pricingMode: 'default',
        quantity: 1,
      },
    },
    ovhSubsidiary: OvhSubsidiary.FR,
    form: {
      description: 'Test Project',
      isContractsChecked: false,
      hasItalyAgreements: false,
      isHdsChecked: false,
    },
    setForm: mockSetForm,
  };

  const mockCartSummary: CartSummary = {
    orderId: 123,
    url: 'https://order-url',
    details: [],
    prices: {
      originalWithoutTax: { value: 10, currencyCode: 'EUR', text: '10.00 €' },
      reduction: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
      tax: { value: 2, currencyCode: 'EUR', text: '2.00 €' },
      withTax: { value: 12, currencyCode: 'EUR', text: '12.00 €' },
      withoutTax: { value: 10, currencyCode: 'EUR', text: '10.00 €' },
    },
    contracts: [
      { name: 'Contract 1', url: 'https://contract1.url' },
      { name: 'Contract 2', url: 'https://contract2.url' },
    ],
  };

  function mockQueryResult<T>(
    data: T,
    isFetching = false,
  ): UseQueryResult<T, Error> {
    return ({
      data,
      isError: false,
      isPending: isFetching,
      isLoading: isFetching,
      isFetching,
      isSuccess: !isFetching,
      status: isFetching ? 'pending' : 'success',
      isFetched: !isFetching,
    } as unknown) as UseQueryResult<T, Error>;
  }

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    vi.mocked(useGetCartSummary).mockReturnValue(
      mockQueryResult(mockCartSummary),
    );
    vi.mocked(useHdsManagement).mockReturnValue({
      shouldDisplayHdsSection: true,
      isHdsPending: false,
      handleHdsToggle: vi.fn(),
    });
  });

  describe('rendering', () => {
    it('should render the basic form structure', () => {
      render(<ConfigStep {...defaultProps} />, { wrapper: createWrapper() });

      expect(
        screen.getByText('pci_project_new_config_description_label'),
      ).toBeInTheDocument();

      // Check ODS input by querying the ods-input element directly
      const odsInput = document.querySelector(
        'ods-input[name="project-description"]',
      );
      expect(odsInput).toHaveAttribute('value', 'Test Project');

      // Look for the contracts component by checking for the actual label it renders
      expect(screen.getByText('order_contracts_label')).toBeInTheDocument();
    });

    it('should render HDS section when shouldDisplayHdsSection is true', () => {
      render(<ConfigStep {...defaultProps} />, { wrapper: createWrapper() });

      // Look for HDS section text that the real component renders
      expect(
        screen.getByText('pci_projects_hds_description'),
      ).toBeInTheDocument();
    });

    it('should not render HDS section when shouldDisplayHdsSection is false', () => {
      vi.mocked(useHdsManagement).mockReturnValue({
        shouldDisplayHdsSection: false,
        isHdsPending: false,
        handleHdsToggle: vi.fn(),
      });

      render(<ConfigStep {...defaultProps} />, { wrapper: createWrapper() });

      expect(
        screen.queryByText('pci_projects_hds_description'),
      ).not.toBeInTheDocument();
    });

    it('should render Italy agreements section for IT subsidiary', () => {
      const propsWithIT = { ...defaultProps, ovhSubsidiary: OvhSubsidiary.IT };

      render(<ConfigStep {...propsWithIT} />, { wrapper: createWrapper() });

      // Look for Italy agreements by checking for the data-testid that the real component renders
      expect(screen.getByTestId('italy-agreements')).toBeInTheDocument();
    });

    it('should not render Italy agreements section for non-IT subsidiary', () => {
      render(<ConfigStep {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.queryByTestId('italy-agreements')).not.toBeInTheDocument();
    });
  });

  describe('form validation', () => {
    it('should show error when description is empty', () => {
      const propsWithEmptyDescription = {
        ...defaultProps,
        form: { ...defaultProps.form, description: '' },
      };

      render(<ConfigStep {...propsWithEmptyDescription} />, {
        wrapper: createWrapper(),
      });

      // Check for error attribute on ODS form field
      const formField = document.querySelector('ods-form-field');
      expect(formField).toHaveAttribute('error', 'error_required_field');
    });

    it('should show error when description is only whitespace', () => {
      const propsWithWhitespaceDescription = {
        ...defaultProps,
        form: { ...defaultProps.form, description: '   ' },
      };

      render(<ConfigStep {...propsWithWhitespaceDescription} />, {
        wrapper: createWrapper(),
      });

      // Check for error attribute on ODS form field
      const formField = document.querySelector('ods-form-field');
      expect(formField).toHaveAttribute('error', 'error_required_field');
    });

    it('should not show error when description is valid', () => {
      render(<ConfigStep {...defaultProps} />, { wrapper: createWrapper() });

      // Check that error attribute is not present
      const formField = document.querySelector('ods-form-field');
      expect(formField).not.toHaveAttribute('error');
    });
  });

  describe('user interactions', () => {
    it('should update description when input changes', async () => {
      render(<ConfigStep {...defaultProps} />, { wrapper: createWrapper() });

      const input = document.querySelector(
        'ods-input[name="project-description"]',
      ) as Element;

      // Simulate ODS input change event
      fireEvent(
        input,
        new CustomEvent('odsChange', {
          detail: { value: 'New Project Name' },
        }),
      );

      await waitFor(() => {
        expect(mockSetForm).toHaveBeenCalledWith(expect.any(Function));
      });

      // Test the form updater function
      const formUpdater = mockSetForm.mock.calls[0][0];
      const newFormState = formUpdater(defaultProps.form);
      expect(newFormState).toEqual({
        ...defaultProps.form,
        description: 'New Project Name',
      });
    });

    it('should handle contracts checkbox change', async () => {
      render(<ConfigStep {...defaultProps} />, { wrapper: createWrapper() });

      // Find the contracts checkbox using the correct selector based on the rendered HTML
      const contractsCheckbox = document.querySelector(
        'ods-checkbox[name="contracts"]',
      ) as Element;

      fireEvent(
        contractsCheckbox,
        new CustomEvent('odsChange', {
          detail: { checked: true },
        }),
      );

      await waitFor(() => {
        expect(mockSetForm).toHaveBeenCalledWith(expect.any(Function));
      });

      // Test the form updater function
      const formUpdater = mockSetForm.mock.calls[0][0];
      const newFormState = formUpdater(defaultProps.form);
      expect(newFormState).toEqual({
        ...defaultProps.form,
        isContractsChecked: true,
      });
    });

    it('should handle HDS checkbox change', async () => {
      const mockHandleHdsToggle = vi.fn();
      vi.mocked(useHdsManagement).mockReturnValue({
        shouldDisplayHdsSection: true,
        isHdsPending: false,
        handleHdsToggle: mockHandleHdsToggle,
      });

      render(<ConfigStep {...defaultProps} />, { wrapper: createWrapper() });

      // Find the HDS checkbox using the correct selector based on the rendered HTML
      const hdsCheckbox = document.querySelector(
        'ods-checkbox[name="isHds"]',
      ) as Element;

      fireEvent(
        hdsCheckbox,
        new CustomEvent('odsChange', {
          detail: { checked: true },
        }),
      );

      expect(mockHandleHdsToggle).toHaveBeenCalledWith(true);
    });

    it('should handle Italy agreements checkbox change', async () => {
      const propsWithIT = { ...defaultProps, ovhSubsidiary: OvhSubsidiary.IT };

      render(<ConfigStep {...propsWithIT} />, { wrapper: createWrapper() });

      // Find the Italy agreements checkbox using the correct selector based on the rendered HTML
      const italyCheckbox = document.querySelector(
        'ods-checkbox[name="project-italy-agreements"]',
      );

      expect(italyCheckbox).toBeInTheDocument();

      fireEvent(
        italyCheckbox as Element,
        new CustomEvent('odsChange', {
          detail: { checked: true },
        }),
      );

      await waitFor(() => {
        expect(mockSetForm).toHaveBeenCalledWith(expect.any(Function));
      });

      // Test the form updater function
      const formUpdater = mockSetForm.mock.calls[0][0];
      const newFormState = formUpdater(defaultProps.form);
      expect(newFormState).toEqual({
        ...defaultProps.form,
        hasItalyAgreements: true,
      });
    });
  });

  describe('loading states', () => {
    it('should pass loading state to contracts when cart summary is fetching', () => {
      vi.mocked(useGetCartSummary).mockReturnValue(
        mockQueryResult(mockCartSummary, true),
      );

      render(<ConfigStep {...defaultProps} />, { wrapper: createWrapper() });

      // Check for skeleton loading component instead of mock loading text
      expect(screen.getByTestId('contracts-skeleton')).toBeInTheDocument();
    });

    it('should pass loading state to HDS when HDS is pending', () => {
      vi.mocked(useHdsManagement).mockReturnValue({
        shouldDisplayHdsSection: true,
        isHdsPending: true,
        handleHdsToggle: vi.fn(),
      });

      render(<ConfigStep {...defaultProps} />, { wrapper: createWrapper() });

      // Find the HDS checkbox and check if it's disabled using the correct selector
      const hdsCheckbox = document.querySelector('ods-checkbox[name="isHds"]');
      expect(hdsCheckbox).toHaveAttribute('is-disabled', 'true');
    });

    it('should combine loading states (HDS pending + contracts fetching)', () => {
      vi.mocked(useGetCartSummary).mockReturnValue(
        mockQueryResult(mockCartSummary, true),
      );
      vi.mocked(useHdsManagement).mockReturnValue({
        shouldDisplayHdsSection: true,
        isHdsPending: true,
        handleHdsToggle: vi.fn(),
      });

      render(<ConfigStep {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByTestId('contracts-skeleton')).toBeInTheDocument();
      const hdsCheckbox = document.querySelector('ods-checkbox[name="isHds"]');
      expect(hdsCheckbox).toHaveAttribute('is-disabled', 'true');
    });
  });

  describe('component props', () => {
    it('should pass correct props to HdsOption component', () => {
      const propsWithHds = {
        ...defaultProps,
        form: { ...defaultProps.form, isHdsChecked: true },
      };

      render(<ConfigStep {...propsWithHds} />, { wrapper: createWrapper() });

      // Check that HDS section is rendered with correct state using the correct selector
      const hdsCheckbox = document.querySelector('ods-checkbox[name="isHds"]');
      expect(hdsCheckbox).toHaveAttribute('is-checked', 'true');
    });

    it('should pass contracts data correctly', () => {
      render(<ConfigStep {...defaultProps} />, { wrapper: createWrapper() });

      // Check that contracts section is rendered - look for contract links
      expect(screen.getByText('Contract 1')).toBeInTheDocument();
      expect(screen.getByText('Contract 2')).toBeInTheDocument();
    });

    it('should handle missing cart summary gracefully', () => {
      vi.mocked(useGetCartSummary).mockReturnValue(
        mockQueryResult(null) as UseQueryResult<CartSummary, Error>,
      );

      render(<ConfigStep {...defaultProps} />, { wrapper: createWrapper() });

      // Check that contracts section still renders even without data using the actual label
      expect(screen.getByText('order_contracts_label')).toBeInTheDocument();
    });
  });

  describe('input constraints', () => {
    it('should enforce maxlength on description input', () => {
      render(<ConfigStep {...defaultProps} />, { wrapper: createWrapper() });

      const input = document.querySelector(
        'ods-input[name="project-description"]',
      );
      expect(input).toHaveAttribute('maxlength', '255');
    });

    it('should have correct input name', () => {
      render(<ConfigStep {...defaultProps} />, { wrapper: createWrapper() });

      const input = document.querySelector(
        'ods-input[name="project-description"]',
      );
      expect(input).toHaveAttribute('name', 'project-description');
    });
  });
});
