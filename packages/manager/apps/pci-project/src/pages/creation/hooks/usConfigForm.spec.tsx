import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { format } from 'date-fns';
import { useConfigForm, ConfigFormState } from './useConfigForm';

vi.mock('date-fns', () => ({
  format: vi.fn(() => '2024-01-15'),
}));

describe('useConfigForm', () => {
  describe('initial state', () => {
    it('should initialize with default form state for non-IT subsidiary', () => {
      const { result } = renderHook(() => useConfigForm(OvhSubsidiary.FR));

      expect(result.current.form).toEqual({
        description: 'Project 2024-01-15',
        isContractsChecked: false,
        hasItalyAgreements: false,
        isHdsChecked: false,
      });
      expect(result.current.isConfigFormValid()).toBe(false);
    });

    it('should initialize with default form state for IT subsidiary', () => {
      const { result } = renderHook(() => useConfigForm(OvhSubsidiary.IT));

      expect(result.current.form).toEqual({
        description: 'Project 2024-01-15',
        isContractsChecked: false,
        hasItalyAgreements: false,
        isHdsChecked: false,
      });
      expect(result.current.isConfigFormValid()).toBe(false);
    });

    it('should call format with current date during initialization', () => {
      renderHook(() => useConfigForm(OvhSubsidiary.FR));

      expect(format).toHaveBeenCalledWith(expect.any(Date), 'yyyy-MM-dd');
    });
  });

  describe('form state management', () => {
    it('should update form state using setForm', () => {
      const { result } = renderHook(() => useConfigForm(OvhSubsidiary.FR));

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
      const { result } = renderHook(() => useConfigForm(OvhSubsidiary.FR));

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
      const { result } = renderHook(() => useConfigForm(OvhSubsidiary.FR));

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
      const { result } = renderHook(() => useConfigForm(OvhSubsidiary.FR));

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
      const { result } = renderHook(() => useConfigForm(OvhSubsidiary.FR));

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
      const { result } = renderHook(() => useConfigForm(OvhSubsidiary.FR));

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
      const { result } = renderHook(() => useConfigForm(OvhSubsidiary.DE));

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
      const { result } = renderHook(() => useConfigForm(OvhSubsidiary.IT));

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
      const { result } = renderHook(() => useConfigForm(OvhSubsidiary.IT));

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
      const { result } = renderHook(() => useConfigForm(OvhSubsidiary.FR));

      expect(result.current).toEqual({
        form: expect.any(Object),
        setForm: expect.any(Function),
        isConfigFormValid: expect.any(Function),
      });
    });

    it('should provide form state with correct properties', () => {
      const { result } = renderHook(() => useConfigForm(OvhSubsidiary.FR));

      expect(result.current.form).toEqual({
        description: expect.any(String),
        isContractsChecked: expect.any(Boolean),
        hasItalyAgreements: expect.any(Boolean),
        isHdsChecked: expect.any(Boolean),
      });
    });
  });
});
