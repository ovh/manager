import { act, renderHook } from '@testing-library/react';
import { describe } from 'vitest';

import { StepsEnum } from '@/pages/detail/nodepools/new/steps.enum';
import { TFormStore, useNewPoolStore } from '@/pages/detail/nodepools/new/store';

describe('NewPoolStore', () => {
  describe('set', () => {
    it('should set name', () => {
      const { result } = renderHook(() => useNewPoolStore());
      act(() => result.current.set.name('test'));
      expect(result.current.name.value).toBe('test');
    });
    it('should set flavor', () => {
      const { result } = renderHook(() => useNewPoolStore());
      act(() => result.current.set.flavor(undefined));
      expect(result.current.flavor).toBe(undefined);
    });
    it('should set autoScaling', () => {
      const { result } = renderHook(() => useNewPoolStore());
      act(() =>
        result.current.set.scaling({
          isAutoscale: false,
          quantity: {
            desired: 3,
            max: 100,
            min: 0,
          },
        }),
      );
      expect(result.current.scaling).toStrictEqual({
        isAutoscale: false,
        quantity: {
          desired: 3,
          max: 100,
          min: 0,
        },
      });
    });
    it('should set flavor', () => {
      const { result } = renderHook(() => useNewPoolStore());
      act(() => result.current.set.antiAffinity(true));
      expect(result.current.antiAffinity).toBe(true);
    });
    it('should set isMonthlyBilling', () => {
      const { result } = renderHook(() => useNewPoolStore());
      act(() => result.current.set.isMonthlyBilling(true));
      expect(result.current.isMonthlyBilling).toBe(true);
    });
  });

  describe('open/close', () => {
    it('should open the right step', () => {
      const { result } = renderHook(() => useNewPoolStore());
      act(() => result.current.open(StepsEnum.BILLING));
      expect(result.current.steps.get(StepsEnum.BILLING).isOpen).toBe(true);
    });

    it('should close the right step', () => {
      const { result } = renderHook(() => useNewPoolStore());
      act(() => result.current.close(StepsEnum.NAME));
      expect(result.current.steps.get(StepsEnum.NAME).isOpen).toBe(false);
    });
  });

  describe('check/uncheck', () => {
    it('should check the right step', () => {
      const { result } = renderHook(() => useNewPoolStore());
      act(() => result.current.check(StepsEnum.BILLING));
      expect(result.current.steps.get(StepsEnum.BILLING).isChecked).toBe(true);
    });

    it('should uncheck the right step', () => {
      const { result } = renderHook(() => useNewPoolStore());
      act(() => result.current.uncheck(StepsEnum.BILLING));
      expect(result.current.steps.get(StepsEnum.BILLING).isChecked).toBe(false);
    });
  });

  describe('lock/unlock', () => {
    it('should lock the right step', () => {
      const { result } = renderHook(() => useNewPoolStore());
      act(() => result.current.lock(StepsEnum.BILLING));
      expect(result.current.steps.get(StepsEnum.BILLING).isLocked).toBe(true);
    });

    it('should unlock the right step', () => {
      const { result } = renderHook(() => useNewPoolStore());
      act(() => result.current.unlock(StepsEnum.BILLING));
      expect(result.current.steps.get(StepsEnum.BILLING).isLocked).toBe(false);
    });
  });

  describe('edit', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useNewPoolStore());
      act(() => {
        result.current.reset();
      });
    });

    const extractState = (
      state: TFormStore,
    ): Omit<
      TFormStore,
      | 'set'
      | 'open'
      | 'close'
      | 'lock'
      | 'unlock'
      | 'check'
      | 'uncheck'
      | 'edit'
      | 'reset'
      | 'scrollToStep'
    > => ({
      name: state.name,
      flavor: state.flavor,
      scaling: state.scaling,
      selectedAvailabilityZone: state.selectedAvailabilityZone,
      antiAffinity: state.antiAffinity,
      isMonthlyBilling: state.isMonthlyBilling,
      steps: state.steps,
    });

    it('should edit name step', () => {
      const { result } = renderHook(() => useNewPoolStore());

      act(() => result.current.edit(StepsEnum.NAME));

      expect(extractState(result.current)).toEqual({
        antiAffinity: false,
        scaling: {
          isAutoscale: false,
          quantity: {
            desired: 3,
            max: 100,
            min: 0,
          },
        },
        flavor: undefined,
        isMonthlyBilling: false,
        name: { value: '', hasError: false, isTouched: false },
        selectedAvailabilityZone: null,
        steps: new Map([
          [
            'NAME',
            {
              isChecked: false,
              isLocked: false,
              isOpen: true,
              ref: { current: null },
            },
          ],
          [
            'TYPE',
            {
              isChecked: false,
              isLocked: false,
              isOpen: false,
              ref: { current: null },
            },
          ],
          [
            'SIZE',
            {
              isChecked: false,
              isLocked: false,
              isOpen: false,
              ref: { current: null },
            },
          ],
          [
            'BILLING',
            {
              isChecked: false,
              isLocked: false,
              isOpen: false,
              ref: { current: null },
            },
          ],
        ]),
      });
    });

    it('should edit type step', () => {
      const { result } = renderHook(() => useNewPoolStore());

      act(() => result.current.edit(StepsEnum.TYPE));

      expect(extractState(result.current)).toEqual({
        antiAffinity: false,
        scaling: {
          isAutoscale: false,
          quantity: {
            desired: 3,
            max: 100,
            min: 0,
          },
        },
        flavor: undefined,
        isMonthlyBilling: false,
        name: { hasError: false, isTouched: false, value: '' },
        selectedAvailabilityZone: null,
        steps: new Map([
          [
            'NAME',
            {
              isChecked: false,
              isLocked: false,
              isOpen: true,
              ref: { current: null },
            },
          ],
          [
            'TYPE',
            {
              isChecked: false,
              isLocked: false,
              isOpen: true,
              ref: { current: null },
            },
          ],
          [
            'SIZE',
            {
              isChecked: false,
              isLocked: false,
              isOpen: false,
              ref: { current: null },
            },
          ],
          [
            'BILLING',
            {
              isChecked: false,
              isLocked: false,
              isOpen: false,
              ref: { current: null },
            },
          ],
        ]),
      });
    });

    it('should edit size step', () => {
      const { result } = renderHook(() => useNewPoolStore());

      act(() => result.current.edit(StepsEnum.SIZE));

      expect(extractState(result.current)).toEqual({
        antiAffinity: false,
        scaling: {
          isAutoscale: false,
          quantity: {
            desired: 3,
            max: 100,
            min: 0,
          },
        },
        flavor: undefined,
        isMonthlyBilling: false,
        name: {
          hasError: false,
          isTouched: false,
          value: '',
        },
        selectedAvailabilityZone: null,
        steps: new Map([
          [
            'NAME',
            {
              isChecked: false,
              isLocked: false,
              isOpen: true,
              ref: { current: null },
            },
          ],
          [
            'TYPE',
            {
              isChecked: false,
              isLocked: false,
              isOpen: false,
              ref: { current: null },
            },
          ],
          [
            'SIZE',
            {
              isChecked: false,
              isLocked: false,
              isOpen: true,
              ref: { current: null },
            },
          ],
          [
            'BILLING',
            {
              isChecked: false,
              isLocked: false,
              isOpen: false,
              ref: { current: null },
            },
          ],
        ]),
      });
    });
  });
});
