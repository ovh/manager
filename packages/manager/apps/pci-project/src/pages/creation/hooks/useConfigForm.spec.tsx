import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { UseQueryResult } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useConfigForm, ConfigFormState } from './useConfigForm';
import {
  useGetCartConfiguration,
  useGetOrderProjectId,
  useIsHdsChecked,
} from '@/data/hooks/useCart';
import { OrderedProduct, CartConfiguration } from '@/data/types/cart.type';

vi.mock('date-fns', () => ({
  format: vi.fn(() => '2024-01-15'),
}));

vi.mock('@/data/hooks/useCart', () => ({
  useGetCartConfiguration: vi.fn(),
  useGetOrderProjectId: vi.fn(),
  useIsHdsChecked: vi.fn(),
}));

describe('useConfigForm', () => {
  const mockProjectItem = {
    cartId: 'cart-1',
    itemId: 123,
    productId: 'product-1',
    configuration: [],
    duration: 'P1M',
    options: [],
    prices: [],
    settings: {
      planCode: 'project.2018',
      pricingMode: 'default',
      quantity: 1,
    },
  };

  const mockCartConfiguration = {
    configurationId: 456,
    label: 'description',
    value: 'Test project from cart',
  };

  const mockHdsItem = {
    cartId: 'cart-1',
    itemId: 789,
    productId: 'hds-product',
    configuration: [],
    duration: 'P1M',
    options: [],
    prices: [],
    settings: {
      planCode: 'certification.hds.2018',
      pricingMode: 'default',
      quantity: 1,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock returns
    vi.mocked(useGetOrderProjectId).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as UseQueryResult<OrderedProduct | undefined, Error>);

    vi.mocked(useGetCartConfiguration).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as UseQueryResult<CartConfiguration | undefined, Error>);

    vi.mocked(useIsHdsChecked).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as UseQueryResult<OrderedProduct | undefined, Error>);
  });

  describe('initial state', () => {
    it('should initialize with default form state for non-IT subsidiary without cartId', () => {
      const { result } = renderHook(() =>
        useConfigForm(OvhSubsidiary.FR, undefined),
      );

      expect(result.current.form).toEqual({
        description: 'Project 2024-01-15',
        isContractsChecked: false,
        hasItalyAgreements: false,
        isHdsChecked: false,
      });
      expect(result.current.isConfigFormValid()).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it('should initialize with cartId-based state when cartId is provided', () => {
      const { result } = renderHook(() =>
        useConfigForm(OvhSubsidiary.FR, 'cart-1'),
      );

      expect(result.current.form).toEqual({
        description: 'Project 2024-01-15',
        isContractsChecked: true, // Should be true when cartId exists
        hasItalyAgreements: true, // Should be true when cartId exists
        isHdsChecked: false,
      });
    });

    it('should initialize with default form state for IT subsidiary', () => {
      const { result } = renderHook(() =>
        useConfigForm(OvhSubsidiary.IT, undefined),
      );

      expect(result.current.form).toEqual({
        description: 'Project 2024-01-15',
        isContractsChecked: false,
        hasItalyAgreements: false,
        isHdsChecked: false,
      });
      expect(result.current.isConfigFormValid()).toBe(false);
    });

    it('should call format with current date during initialization', () => {
      renderHook(() => useConfigForm(OvhSubsidiary.FR, undefined));

      expect(format).toHaveBeenCalledWith(expect.any(Date), 'yyyy-MM-dd');
    });
  });

  describe('loading states', () => {
    it('should return loading true when project is loading', () => {
      vi.mocked(useGetOrderProjectId).mockReturnValue({
        data: undefined,
        isLoading: true,
      } as UseQueryResult<OrderedProduct | undefined, Error>);

      const { result } = renderHook(() =>
        useConfigForm(OvhSubsidiary.FR, 'cart-1'),
      );

      expect(result.current.isLoading).toBe(true);
    });

    it('should return loading true when cart configuration is loading', () => {
      vi.mocked(useGetCartConfiguration).mockReturnValue({
        data: undefined,
        isLoading: true,
      } as UseQueryResult<CartConfiguration | undefined, Error>);

      const { result } = renderHook(() =>
        useConfigForm(OvhSubsidiary.FR, 'cart-1'),
      );

      expect(result.current.isLoading).toBe(true);
    });

    it('should return loading true when HDS is loading', () => {
      vi.mocked(useIsHdsChecked).mockReturnValue({
        data: undefined,
        isLoading: true,
      } as UseQueryResult<OrderedProduct | undefined, Error>);

      const { result } = renderHook(() =>
        useConfigForm(OvhSubsidiary.FR, 'cart-1'),
      );

      expect(result.current.isLoading).toBe(true);
    });

    it('should return loading false when all hooks have finished loading', () => {
      const { result } = renderHook(() =>
        useConfigForm(OvhSubsidiary.FR, 'cart-1'),
      );

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('data synchronization effects', () => {
    it('should update description when cart configuration is available', () => {
      vi.mocked(useGetOrderProjectId).mockReturnValue(({
        data: mockProjectItem,
        isLoading: false,
      } as unknown) as UseQueryResult<OrderedProduct | undefined, Error>);

      vi.mocked(useGetCartConfiguration).mockReturnValue(({
        data: mockCartConfiguration,
        isLoading: false,
      } as unknown) as UseQueryResult<CartConfiguration | undefined, Error>);

      const { result } = renderHook(() =>
        useConfigForm(OvhSubsidiary.FR, 'cart-1'),
      );

      expect(result.current.form.description).toBe('Test project from cart');
    });

    it('should handle empty cart configuration value', () => {
      vi.mocked(useGetOrderProjectId).mockReturnValue(({
        data: mockProjectItem,
        isLoading: false,
      } as unknown) as UseQueryResult<OrderedProduct | undefined, Error>);

      vi.mocked(useGetCartConfiguration).mockReturnValue(({
        data: { ...mockCartConfiguration, value: '' },
        isLoading: false,
      } as unknown) as UseQueryResult<CartConfiguration | undefined, Error>);

      const { result } = renderHook(() =>
        useConfigForm(OvhSubsidiary.FR, 'cart-1'),
      );

      expect(result.current.form.description).toBe('');
    });

    it('should not update description when cart configuration is undefined', () => {
      const { result } = renderHook(() =>
        useConfigForm(OvhSubsidiary.FR, 'cart-1'),
      );

      expect(result.current.form.description).toBe('Project 2024-01-15');
    });

    it('should update isHdsChecked when HDS item is available', () => {
      vi.mocked(useIsHdsChecked).mockReturnValue(({
        data: mockHdsItem,
        isLoading: false,
      } as unknown) as UseQueryResult<OrderedProduct | undefined, Error>);

      const { result } = renderHook(() =>
        useConfigForm(OvhSubsidiary.FR, 'cart-1'),
      );

      expect(result.current.form.isHdsChecked).toBe(true);
    });

    it('should not update isHdsChecked when HDS item is undefined', () => {
      const { result } = renderHook(() =>
        useConfigForm(OvhSubsidiary.FR, 'cart-1'),
      );

      expect(result.current.form.isHdsChecked).toBe(false);
    });
  });

  describe('hook calls with correct parameters', () => {
    it('should call useGetOrderProjectId with cartId', () => {
      renderHook(() => useConfigForm(OvhSubsidiary.FR, 'test-cart'));

      expect(useGetOrderProjectId).toHaveBeenCalledWith('test-cart');
    });

    it('should call useGetCartConfiguration with correct parameters', () => {
      vi.mocked(useGetOrderProjectId).mockReturnValue(({
        data: mockProjectItem,
        isLoading: false,
      } as unknown) as UseQueryResult<OrderedProduct | undefined, Error>);

      renderHook(() => useConfigForm(OvhSubsidiary.FR, 'test-cart'));

      expect(useGetCartConfiguration).toHaveBeenCalledWith(
        'description',
        'test-cart',
        mockProjectItem.itemId,
      );
    });

    it('should call useGetCartConfiguration with undefined itemId when project item is not available', () => {
      renderHook(() => useConfigForm(OvhSubsidiary.FR, 'test-cart'));

      expect(useGetCartConfiguration).toHaveBeenCalledWith(
        'description',
        'test-cart',
        undefined,
      );
    });

    it('should call useIsHdsChecked with cartId', () => {
      renderHook(() => useConfigForm(OvhSubsidiary.FR, 'test-cart'));

      expect(useIsHdsChecked).toHaveBeenCalledWith('test-cart');
    });
  });

  describe('form state management', () => {
    it('should update form state using setForm', () => {
      const { result } = renderHook(() =>
        useConfigForm(OvhSubsidiary.FR, undefined),
      );

      const newFormState: ConfigFormState = {
        description: 'My Custom Project',
        isContractsChecked: true,
        hasItalyAgreements: true,
        isHdsChecked: true,
      };

      act(() => {
        result.current.setForm(newFormState);
      });

      expect(result.current.form).toEqual(newFormState);
    });

    it('should update form state partially using functional setForm', () => {
      const { result } = renderHook(() =>
        useConfigForm(OvhSubsidiary.FR, undefined),
      );

      act(() => {
        result.current.setForm((prev) => ({
          ...prev,
          description: 'Updated Project',
          isContractsChecked: true,
        }));
      });

      expect(result.current.form).toEqual({
        description: 'Updated Project',
        isContractsChecked: true,
        hasItalyAgreements: false,
        isHdsChecked: false,
      });
    });
  });

  describe('form validation - non-IT subsidiary', () => {
    it('should be invalid when description is empty', () => {
      const { result } = renderHook(() =>
        useConfigForm(OvhSubsidiary.FR, undefined),
      );

      act(() => {
        result.current.setForm((prev) => ({
          ...prev,
          description: '',
          isContractsChecked: true,
        }));
      });

      expect(result.current.isConfigFormValid()).toBe(false);
    });

    it('should be invalid when description is only whitespace', () => {
      const { result } = renderHook(() =>
        useConfigForm(OvhSubsidiary.FR, undefined),
      );

      act(() => {
        result.current.setForm((prev) => ({
          ...prev,
          description: '   ',
          isContractsChecked: true,
        }));
      });

      expect(result.current.isConfigFormValid()).toBe(false);
    });

    it('should be invalid when contracts are not checked', () => {
      const { result } = renderHook(() =>
        useConfigForm(OvhSubsidiary.FR, undefined),
      );

      act(() => {
        result.current.setForm((prev) => ({
          ...prev,
          description: 'Valid Project',
          isContractsChecked: false,
        }));
      });

      expect(result.current.isConfigFormValid()).toBe(false);
    });

    it('should be valid when all required fields are filled for non-IT subsidiary', () => {
      const { result } = renderHook(() =>
        useConfigForm(OvhSubsidiary.FR, undefined),
      );

      act(() => {
        result.current.setForm((prev) => ({
          ...prev,
          description: 'Valid Project',
          isContractsChecked: true,
        }));
      });

      expect(result.current.isConfigFormValid()).toBe(true);
    });

    it('should be valid for non-IT subsidiary regardless of hasItalyAgreements', () => {
      const { result } = renderHook(() =>
        useConfigForm(OvhSubsidiary.DE, undefined),
      );

      act(() => {
        result.current.setForm((prev) => ({
          ...prev,
          description: 'Valid Project',
          isContractsChecked: true,
          hasItalyAgreements: false, // This should not affect validation for non-IT
        }));
      });

      expect(result.current.isConfigFormValid()).toBe(true);
    });
  });

  describe('form validation - IT subsidiary', () => {
    it('should be invalid when Italy agreements are not checked for IT subsidiary', () => {
      const { result } = renderHook(() =>
        useConfigForm(OvhSubsidiary.IT, undefined),
      );

      act(() => {
        result.current.setForm((prev) => ({
          ...prev,
          description: 'Valid Project',
          isContractsChecked: true,
          hasItalyAgreements: false,
        }));
      });

      expect(result.current.isConfigFormValid()).toBe(false);
    });

    it('should be valid when all required fields including Italy agreements are filled for IT subsidiary', () => {
      const { result } = renderHook(() =>
        useConfigForm(OvhSubsidiary.IT, undefined),
      );

      act(() => {
        result.current.setForm((prev) => ({
          ...prev,
          description: 'Valid Project',
          isContractsChecked: true,
          hasItalyAgreements: true,
        }));
      });

      expect(result.current.isConfigFormValid()).toBe(true);
    });
  });

  describe('return values', () => {
    it('should provide all expected return values', () => {
      const { result } = renderHook(() =>
        useConfigForm(OvhSubsidiary.FR, undefined),
      );

      expect(result.current).toEqual({
        form: expect.any(Object),
        setForm: expect.any(Function),
        isConfigFormValid: expect.any(Function),
        isLoading: expect.any(Boolean),
      });
    });

    it('should provide form state with correct properties', () => {
      const { result } = renderHook(() =>
        useConfigForm(OvhSubsidiary.FR, undefined),
      );

      expect(result.current.form).toEqual({
        description: expect.any(String),
        isContractsChecked: expect.any(Boolean),
        hasItalyAgreements: expect.any(Boolean),
        isHdsChecked: expect.any(Boolean),
      });
    });
  });
});
