import { describe, Mock, vi } from 'vitest';
import {
  StepComponent,
  TStepProps,
  useMe,
} from '@ovh-ux/manager-react-components';
import { render, renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useTracking } from '@ovh-ux/manager-react-shell-client';
import { wrapper } from '@/wrapperRenders';
import { NameStep } from './NameStep';
import { StepsEnum, TAddon, useCreateStore } from '@/pages/create/store';
import { TRegion } from '@/api/hook/useRegions';
import { LOAD_BALANCER_CREATION_TRACKING } from '@/constants';

vi.mock('react-router-dom', async () => {
  const { useNavigate, ...rest } = await vi.importActual('react-router-dom');

  return {
    ...rest,
    useNavigate: vi.fn().mockImplementation(() => vi.fn()),
  };
});

vi.mock('@ovh-ux/manager-react-shell-client', async () => {
  const { ...rest } = await vi.importActual(
    '@ovh-ux/manager-react-shell-client',
  );

  return {
    ...rest,
    useTracking: vi.fn().mockImplementation(() => ({
      trackClick: vi.fn(),
      trackPage: vi.fn(),
    })),
  };
});

vi.mock('@ovh-ux/manager-react-components', async () => {
  const { StepComponent: ActualStepComponent, ...rest } = await vi.importActual(
    '@ovh-ux/manager-react-components',
  );

  return {
    ...rest,
    useMe: vi.fn(),
    StepComponent: vi
      .fn()
      .mockImplementation(ActualStepComponent as typeof StepComponent),
  };
});

vi.mock('@/api/hook/useFlavors', async () => {
  const { ...rest } = await vi.importActual('@/api/hook/useAddons');
  return {
    ...rest,
    useGetFlavor: vi
      .fn()
      .mockImplementation(() => ({ data: undefined, isPending: true })),
  };
});

vi.mock('@ovhcloud/ods-components/react', async () => {
  const { OsdsFormField: ActualOsdsFormField, ...rest } = await vi.importActual(
    '@ovhcloud/ods-components/react',
  );
  const OsdsFormFieldElem = ActualOsdsFormField as React.ElementType;
  return {
    ...rest,
    OsdsFormField: vi.fn().mockImplementation(({ children, ...props }) => (
      <OsdsFormFieldElem {...props} data-testid="field">
        {children}
      </OsdsFormFieldElem>
    )),
  };
});

vi.mock('@/pages/create/hooks/useTrackStep', async () => ({
  useTrackStep: vi.fn().mockImplementation(() => ({ trackStep: vi.fn() })),
}));

describe('NameStep', () => {
  describe('render', () => {
    beforeAll(() => {
      (useMe as Mock).mockImplementation(() => ({ me: undefined }));

      const { result } = renderHook(() => useCreateStore());
      act(() => result.current.open(StepsEnum.NAME));

      render(<NameStep />, { wrapper });
    });
    it('should render NameComponent with right props', () => {
      const call = (StepComponent as Mock).mock.calls[0][0] as TStepProps;

      expect(call.title).toBe('octavia_load_balancer_create_name_field_label');

      expect(call.isOpen).toBe(true);

      expect(call.isChecked).toBe(false);

      expect(call.isLocked).toBe(false);

      expect(call.order).toBe(6);

      expect(call.next).toBe(undefined);
    });
  });

  describe('Field', () => {
    beforeAll(() => {
      (useMe as Mock).mockImplementation(() => ({ me: undefined }));
      const { result } = renderHook(() => useCreateStore());
      act(() => result.current.open(StepsEnum.NAME));
    });
    it('should render field', () => {
      const { queryByTestId } = render(<NameStep />, { wrapper });

      expect(queryByTestId('field')).toBeInTheDocument();
    });

    describe('error', () => {
      it('should not show if name is valid', () => {
        const { result } = renderHook(() => useCreateStore());
        act(() => result.current.set.name('load-balancer-name'));

        const { queryByTestId } = render(<NameStep />, { wrapper });

        expect(queryByTestId('field')).toHaveAttribute('error', '');
      });

      it('should show if name does not match regex', () => {
        const { result } = renderHook(() => useCreateStore());
        act(() => result.current.set.name('namé'));

        const { queryByTestId } = render(<NameStep />, { wrapper });

        expect(queryByTestId('field')).toHaveAttribute(
          'error',
          'common_field_error_pattern',
        );
      });

      it('should show if name is too long', () => {
        const { result } = renderHook(() => useCreateStore());
        act(() => result.current.set.name('a'.padStart(71, '_')));

        const { queryByTestId } = render(<NameStep />, { wrapper });

        expect(queryByTestId('field')).toHaveAttribute(
          'error',
          'common_field_error_maxlength',
        );
      });
    });
  });

  describe('create', () => {
    it('should track', () => {
      const [trackClickSpy, trackPageSpy] = [vi.fn(), vi.fn()];

      const { result } = renderHook(() => useCreateStore());

      act(() => {
        result.current.set.addon({ code: 'code' } as TAddon);
        result.current.set.region({ name: 'name' } as TRegion);
        result.current.set.name('');
      });

      (useTracking as Mock).mockImplementation(() => ({
        trackClick: trackClickSpy,
        trackPage: trackPageSpy,
      }));

      const { queryByText } = render(<NameStep />, { wrapper });

      act(() => queryByText('octavia_load_balancer_create_title').click());

      expect(trackClickSpy).toHaveBeenCalledTimes(2);

      expect(trackClickSpy).toHaveBeenNthCalledWith(1, {
        name: LOAD_BALANCER_CREATION_TRACKING.SUBMIT,
        type: 'action',
      });

      expect(trackClickSpy).toHaveBeenNthCalledWith(2, {
        name: `${LOAD_BALANCER_CREATION_TRACKING.CONFIRM}::code::name`,
        type: 'action',
      });
    });
  });

  describe('cancel', () => {
    it('should track', () => {
      const [trackClickSpy, trackPageSpy] = [vi.fn(), vi.fn()];

      (useTracking as Mock).mockImplementation(() => ({
        trackClick: trackClickSpy,
        trackPage: trackPageSpy,
      }));

      const { queryByText } = render(<NameStep />, { wrapper });

      act(() => queryByText('common_cancel').click());

      expect(trackClickSpy).toHaveBeenNthCalledWith(1, {
        name: LOAD_BALANCER_CREATION_TRACKING.CANCEL,
        type: 'action',
      });
    });

    it.skip('should navigate to listing page', () => {
      const [trackClickSpy, trackPageSpy] = [vi.fn(), vi.fn()];

      (useTracking as Mock).mockImplementation(() => ({
        trackClick: trackClickSpy,
        trackPage: trackPageSpy,
      }));

      const { queryByText } = render(<NameStep />, { wrapper });

      act(() => queryByText('common_cancel').click());

      expect(trackClickSpy).toHaveBeenNthCalledWith(1, {
        name: LOAD_BALANCER_CREATION_TRACKING.CANCEL,
        type: 'action',
      });
    });
  });
});
