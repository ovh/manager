import { describe, Mock, vi } from 'vitest';
import {
  StepComponent,
  TilesInputComponent,
  TStepProps,
  useMe,
} from '@ovh-ux/manager-react-components';
import { render, renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { OsdsLink, OsdsSpinner } from '@ovhcloud/ods-components/react';
import { wrapper } from '@/wrapperRenders';
import { RegionStep } from '@/pages/create/steps/RegionStep';
import { StepsEnum, TAddon, useCreateStore } from '@/pages/create/store';
import { REGION_AVAILABILITY_LINK } from '@/constants';
import { TRegion, useGetRegions } from '@/api/hook/useRegions';
import { useTrackStep } from '@/pages/create/hooks/useTrackStep';

vi.mock('react-use', async () => ({
  useMedia: vi.fn().mockReturnValue(true),
}));

vi.mock('@/pages/create/hooks/useTrackStep', async () => ({
  useTrackStep: vi.fn().mockImplementation(() => ({ trackStep: vi.fn() })),
}));

vi.mock('@ovhcloud/ods-components/react', async () => {
  const {
    OsdsLink: ActualOsdsLink,
    OsdsSpinner: ActualOsdsSpinner,
    ...rest
  } = await vi.importActual('@ovhcloud/ods-components/react');
  const [OsdsLinkElem, OsdsSpinnerElem] = [
    ActualOsdsLink as React.ElementType,
    ActualOsdsSpinner as React.ElementType,
  ];
  return {
    ...rest,
    OsdsSpinner: vi
      .fn()
      .mockImplementation(({ props, children }) => (
        <OsdsSpinnerElem {...props}>{children}</OsdsSpinnerElem>
      )),
    OsdsLink: vi
      .fn()
      .mockImplementation(({ props, children }) => (
        <OsdsLinkElem {...props}>{children}</OsdsLinkElem>
      )),
  };
});

vi.mock('@ovh-ux/manager-react-components', async () => {
  const {
    StepComponent: ActualStepComponent,
    TilesInputComponent: ActualTilesInputComponent,
    ...rest
  } = await vi.importActual('@ovh-ux/manager-react-components');
  return {
    ...rest,
    useMe: vi.fn(),
    StepComponent: vi
      .fn()
      .mockImplementation(ActualStepComponent as typeof StepComponent),
    TilesInputComponent: vi
      .fn()
      .mockImplementation(
        ActualTilesInputComponent as typeof TilesInputComponent,
      ),
  };
});

vi.mock('@/api/hook/useRegions', async () => {
  const actual = await vi.importActual('@/api/hook/useRegions');
  return {
    ...actual,
    useGetRegions: vi
      .fn()
      .mockImplementation(() => ({ data: undefined, isPending: true })),
  };
});

describe('RegionStep', () => {
  describe('should render', () => {
    beforeAll(() => {
      (useMe as Mock).mockImplementation(() => ({ me: undefined }));

      render(<RegionStep />, { wrapper });
    });
    it('should render StepComponent with right props', () => {
      (StepComponent as Mock).mockImplementationOnce(({ children }) => (
        <div>{children}</div>
      ));

      const { result } = renderHook(() => useCreateStore());

      act(() => result.current.open(StepsEnum.REGION));
      const { calls } = (StepComponent as Mock).mock;
      const call = calls[calls.length - 1][0] as TStepProps;

      expect(call.title).toBe('octavia_load_balancer_create_region_title');

      expect(call.isOpen).toBe(true);

      expect(call.isChecked).toBe(false);

      expect(call.isLocked).toBe(false);

      expect(call.order).toBe(2);

      expect(call.next.label).toBe('common_stepper_next_button_label');
      expect(call.next.isDisabled).toBe(true);

      expect(call.edit.label).toBe('common_stepper_modify_this_step');
    });

    describe('Region availability link', () => {
      it("should render ovhSubsidiary region's availability link if found", () => {
        ((OsdsLink as unknown) as Mock).mockImplementationOnce(({ href }) => (
          <a href={href} data-testid="link"></a>
        ));
        (useMe as Mock).mockImplementation(() => ({
          me: { ovhSubsidiary: 'FR' },
        }));
        const { getByTestId } = render(<RegionStep />, { wrapper });

        expect(getByTestId('link').attributes.getNamedItem('href').value).toBe(
          REGION_AVAILABILITY_LINK.FR,
        );
      });

      it("should render default region's availability link if not found", () => {
        ((OsdsLink as unknown) as Mock).mockImplementationOnce(({ href }) => (
          <a href={href} data-testid="link"></a>
        ));
        (useMe as Mock).mockImplementation(() => ({
          me: undefined,
        }));
        const { getByTestId } = render(<RegionStep />, { wrapper });

        expect(getByTestId('link').attributes.getNamedItem('href').value).toBe(
          REGION_AVAILABILITY_LINK.DEFAULT,
        );
      });
    });

    describe('regions', () => {
      it('should show spinner if regions are pending', () => {
        (useGetRegions as Mock).mockImplementationOnce(() => ({
          data: undefined,
          isPending: true,
        }));

        ((OsdsSpinner as unknown) as Mock).mockImplementationOnce(() => (
          <div data-testid="spinner"></div>
        ));

        const { getByTestId } = render(<RegionStep />, { wrapper });

        expect(getByTestId('spinner')).toBeInTheDocument();
      });

      it('should show input if regions are not pending', () => {
        (useGetRegions as Mock).mockImplementation(() => ({
          data: undefined,
          isPending: false,
        }));

        ((TilesInputComponent as unknown) as Mock).mockImplementationOnce(
          () => <div data-testid="input"></div>,
        );

        const { getByTestId } = render(<RegionStep />, { wrapper });

        expect(getByTestId('input')).toBeInTheDocument();
      });
    });
  });

  describe('Actions', () => {
    beforeAll(() => {
      (useGetRegions as Mock).mockImplementationOnce(() => ({
        isPending: false,
      }));
      (TilesInputComponent as Mock).mockImplementationOnce(() => (
        <div data-testid="input"></div>
      ));
    });

    describe('next', () => {
      describe('render', () => {
        test('Next button should be disabled if region is not set', () => {
          const { getByText } = render(<RegionStep />, { wrapper });

          const nextButton = getByText('common_stepper_next_button_label');
          expect(
            nextButton.attributes.getNamedItem('disabled').value,
          ).toBeTruthy();
        });

        test('Next button should be enabled if region is set', () => {
          (TilesInputComponent as Mock).mockImplementationOnce(() => (
            <div data-testid="input"></div>
          ));

          const { result } = renderHook(() => useCreateStore());
          act(() => result.current.set.region({} as TRegion));

          const { getByText } = render(<RegionStep />, { wrapper });
          const nextButton = getByText('common_stepper_next_button_label');
          expect(
            nextButton.attributes.getNamedItem('disabled')?.value,
          ).toBeFalsy();
        });
      });
      describe('click', () => {
        it('Should track on next click', async () => {
          (TilesInputComponent as Mock).mockImplementationOnce(() => (
            <div data-testid="input"></div>
          ));
          const trackStepSpy = vi.fn();

          const { result } = renderHook(() => useCreateStore());
          act(() => result.current.set.region({} as TRegion));

          (useTrackStep as Mock).mockImplementationOnce(() => ({
            trackStep: trackStepSpy,
          }));

          const { getByText } = render(<RegionStep />, { wrapper });

          const nextButton = getByText('common_stepper_next_button_label');

          act(() => nextButton.click());

          expect(trackStepSpy).toHaveBeenCalledWith(2);
        });
      });
    });

    // TODO test edit
  });
});
