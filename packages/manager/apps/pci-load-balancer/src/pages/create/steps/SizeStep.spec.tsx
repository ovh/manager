import { describe, Mock, vi } from 'vitest';
import {
  StepComponent,
  TStepProps,
  useMe,
} from '@ovh-ux/manager-react-components';
import { render, renderHook } from '@testing-library/react';
import { OsdsLink, OsdsSpinner } from '@ovhcloud/ods-components/react';
import { act } from 'react-dom/test-utils';
import { SizeStep } from './SizeStep';
import { wrapper } from '@/wrapperRenders';
import { useGetAddons } from '@/api/hook/useAddons';
import { PRODUCT_LINK } from '@/constants';
import SizeInputComponent from '@/pages/create/SizeInput.component';
import { useTrackStep } from '@/pages/create/hooks/useTrackStep';
import { StepsEnum, TAddon, useCreateStore } from '@/pages/create/store';

vi.mock('@/pages/create/hooks/useTrackStep', async () => ({
  useTrackStep: vi.fn().mockImplementation(() => ({ trackStep: vi.fn() })),
}));

vi.mock('@ovhcloud/ods-components/react', async () => {
  const {
    OsdsSpinner: ActualOsdsSpinner,
    OsdsLink: ActualOsdsLink,
    ...rest
  } = await vi.importActual('@ovhcloud/ods-components/react');
  const [OsdsSpinnerElem, OsdsLinkElem] = [
    ActualOsdsSpinner as React.ElementType,
    ActualOsdsLink as React.ElementType,
  ];
  return {
    ...rest,
    OsdsSpinner: vi
      .fn()
      .mockImplementation(OsdsSpinnerElem as typeof OsdsSpinner),
    OsdsLink: vi
      .fn()
      .mockImplementation(({ props, children }) => (
        <OsdsLinkElem {...props}>{children}</OsdsLinkElem>
      )),
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

vi.mock('@/api/hook/useAddons', async () => {
  const actual = await vi.importActual('@/api/hook/useAddons');
  return {
    ...actual,
    useGetAddons: vi
      .fn()
      .mockImplementation(() => ({ data: undefined, isPending: false })),
  };
});

vi.mock('@/pages/create/SizeInput.component', async () => {
  const { default: ActualDefault, ...rest } = await vi.importActual(
    '@/pages/create/SizeInput.component',
  );
  return {
    ...rest,
    default: vi
      .fn()
      .mockImplementation(ActualDefault as typeof SizeInputComponent),
  };
});

describe('SizeStep', () => {
  // TODO add snapshot test
  describe('should render', () => {
    beforeAll(() => {
      (useMe as Mock).mockImplementation(() => ({ me: undefined }));
      (StepComponent as Mock).mockImplementationOnce(({ children }) => (
        <div>{children}</div>
      ));

      render(<SizeStep />, { wrapper });
    });
    it('should render StepComponent with right props', () => {
      const call = (StepComponent as Mock).mock.calls[0][0] as TStepProps;

      expect(call.title).toBe('octavia_load_balancer_create_size_title');

      expect(call.isOpen).toBe(true);

      expect(call.isChecked).toBe(false);

      expect(call.isLocked).toBe(false);

      expect(call.order).toBe(1);

      expect(call.next.label).toBe('common_stepper_next_button_label');
      expect(call.next.isDisabled).toBe(true);

      expect(call.edit.label).toBe('common_stepper_modify_this_step');
    });

    describe('Product link', () => {
      it('should render ovhSubsidiary product link if found', () => {
        ((OsdsLink as unknown) as Mock).mockImplementationOnce(({ href }) => (
          <a href={href} data-testid="link"></a>
        ));
        (useMe as Mock).mockImplementation(() => ({
          me: { ovhSubsidiary: 'FR' },
        }));
        const { getByTestId } = render(<SizeStep />, { wrapper });

        expect(getByTestId('link').attributes.getNamedItem('href').value).toBe(
          PRODUCT_LINK.FR,
        );
      });

      it('should render default product link if not found', () => {
        ((OsdsLink as unknown) as Mock).mockImplementationOnce(({ href }) => (
          <a href={href} data-testid="link"></a>
        ));
        (useMe as Mock).mockImplementation(() => ({
          me: undefined,
        }));
        const { getByTestId } = render(<SizeStep />, { wrapper });

        expect(getByTestId('link').attributes.getNamedItem('href').value).toBe(
          PRODUCT_LINK.DEFAULT,
        );
      });
    });

    describe('Addons', () => {
      it('should show spinner if addons are pending', () => {
        (useGetAddons as Mock).mockImplementation(() => ({
          data: undefined,
          isPending: true,
        }));

        ((OsdsSpinner as unknown) as Mock).mockImplementation(() => (
          <div data-testid="spinner"></div>
        ));

        const { getByTestId } = render(<SizeStep />, { wrapper });

        expect(getByTestId('spinner')).toBeInTheDocument();
      });

      it('should show input if addons are not pending', () => {
        (useGetAddons as Mock).mockImplementation(() => ({
          data: undefined,
          isPending: false,
        }));

        ((SizeInputComponent as unknown) as Mock).mockImplementationOnce(() => (
          <div data-testid="input"></div>
        ));

        const { getByTestId } = render(<SizeStep />, { wrapper });

        expect(getByTestId('input')).toBeInTheDocument();
      });
    });
  });
  describe('Actions', () => {
    beforeAll(() => {
      (useGetAddons as Mock).mockImplementationOnce(() => ({
        isPending: false,
      }));
      (SizeInputComponent as Mock).mockImplementationOnce(() => (
        <div data-testid="input"></div>
      ));
    });

    describe('next', () => {
      describe('render', () => {
        test('Next button should be disabled if addon is not set', () => {
          const { getByText } = render(<SizeStep />, { wrapper });

          const nextButton = getByText('common_stepper_next_button_label');
          expect(
            nextButton.attributes.getNamedItem('disabled').value,
          ).toBeTruthy();
        });

        test('Next button should be enabled if addon is set', () => {
          const { result } = renderHook(() => useCreateStore());
          act(() => result.current.set.addon({} as TAddon));

          const { getByText } = render(<SizeStep />, { wrapper });

          const nextButton = getByText('common_stepper_next_button_label');
          expect(
            nextButton.attributes.getNamedItem('disabled')?.value,
          ).toBeFalsy();
        });
      });
      describe('click', () => {
        it('Should track on next click', async () => {
          const trackStepSpy = vi.fn();

          const { result } = renderHook(() => useCreateStore());
          act(() => result.current.set.addon({} as TAddon));

          (useTrackStep as Mock).mockImplementationOnce(() => ({
            trackStep: trackStepSpy,
          }));

          const { getByText } = render(<SizeStep />, { wrapper });

          const nextButton = getByText('common_stepper_next_button_label');

          act(() => nextButton.click());

          expect(trackStepSpy).toHaveBeenCalledWith(1);
        });
        test("Prepare region's step on next click", () => {
          const { result } = renderHook(() => useCreateStore());
          act(() => {
            result.current.reset();
            result.current.set.addon({} as TAddon);
          });

          const { getByText } = render(<SizeStep />, { wrapper });

          const nextButton = getByText('common_stepper_next_button_label');

          act(() => nextButton.click());

          expect([
            result.current.steps.get(StepsEnum.SIZE).isChecked,
            result.current.steps.get(StepsEnum.SIZE).isLocked,
            result.current.steps.get(StepsEnum.REGION).isOpen,
          ]).toEqual([true, true, true]);
        });
      });
    });

    // TODO test edit
  });
});
