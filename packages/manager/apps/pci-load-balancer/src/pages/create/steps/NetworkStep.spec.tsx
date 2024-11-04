import { describe, Mock, vi } from 'vitest';
import {
  StepComponent,
  TStepProps,
  useMe,
} from '@ovh-ux/manager-react-components';
import { render, renderHook } from '@testing-library/react';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { act } from 'react-dom/test-utils';
import { NetworkStep } from './NetworkStep';
import { wrapper } from '@/wrapperRenders';
import { useTrackStep } from '@/pages/create/hooks/useTrackStep';
import { StepsEnum, useCreateStore } from '@/pages/create/store';
import { useGetFloatingIps } from '@/api/hook/useFloatingIps';
import { TFloatingIp } from '@/api/data/floating-ips';
import { useGetRegionPrivateNetworks } from '@/api/hook/useNetwork';

vi.mock('@/pages/create/hooks/useTrackStep', async () => ({
  useTrackStep: vi.fn().mockImplementation(() => ({ trackStep: vi.fn() })),
}));

vi.mock('@ovhcloud/ods-components/react', async () => {
  const {
    OsdsLink: ActualOsdsLink,
    OsdsSpinner: ActualOsdsSpinner,
    OsdsFormField: ActualOsdsFormField,
    OsdsSelect: ActualOsdsSelect,
    ...rest
  } = await vi.importActual('@ovhcloud/ods-components/react');
  const [OsdsLinkElem, OsdsSpinnerElem, OsdsFormFieldElem, OsdsSelectElem] = [
    ActualOsdsLink as React.ElementType,
    ActualOsdsSpinner as React.ElementType,
    ActualOsdsFormField as React.ElementType,
    ActualOsdsSelect as React.ElementType,
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
    OsdsFormField: vi.fn().mockImplementation(({ props, children }) => (
      <OsdsFormFieldElem {...props} data-testid="form-field">
        {children}
      </OsdsFormFieldElem>
    )),
    OsdsSelect: vi.fn().mockImplementation(({ props, children }) => (
      <OsdsSelectElem {...props} data-testid="select">
        {children}
      </OsdsSelectElem>
    )),
  };
});

vi.mock('@ovh-ux/manager-react-components', async () => {
  const { StepComponent: ActualStepComponent, ...rest } = await vi.importActual(
    '@ovh-ux/manager-react-components',
  );
  return {
    ...rest,
    useProjectUrl: vi.fn().mockReturnValue('projectHref'),
    useMe: vi.fn(),
    StepComponent: vi
      .fn()
      .mockImplementation(ActualStepComponent as typeof StepComponent),
    useCatalogPrice: vi
      .fn()
      .mockImplementation(() => ({ getFormattedHourlyCatalogPrice: vi.fn() })),
  };
});

vi.mock('@/api/hook/useNetwork', async () => {
  const actual = await vi.importActual('@/api/hook/useFloatingIps');
  return {
    ...actual,
    useGetPrivateNetworkSubnets: vi.fn().mockImplementation(() => ({
      data: undefined,
      isPending: true,
      list: [],
    })),
    useGetRegionPrivateNetworks: vi.fn().mockImplementation(() => ({
      data: undefined,
      isPending: true,
      list: [],
    })),
  };
});

vi.mock('@ovh-ux/manager-pci-common', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-pci-common');
  return {
    ...actual,
    useCatalog: vi
      .fn()
      .mockImplementation(() => ({ data: undefined, isPending: true })),
  };
});

describe('NetworkStepStep', () => {
  // TODO add snapshot test
  describe('should render', () => {
    beforeAll(() => {
      (useMe as Mock).mockImplementation(() => ({ me: undefined }));
      (StepComponent as Mock).mockImplementationOnce(({ children }) => (
        <div>{children}</div>
      ));

      render(<NetworkStep />, { wrapper });
    });
    it.skip('should render StepComponent with right props', () => {
      const { result } = renderHook(() => useCreateStore());

      act(() => result.current.open(StepsEnum.PRIVATE_NETWORK));
      const { calls } = (StepComponent as Mock).mock;
      const call = calls[calls.length - 1][0] as TStepProps;

      expect(call.title).toBe(
        'octavia_load_balancer_create_private_network_title',
      );

      expect(call.isOpen).toBe(true);

      expect(call.isChecked).toBe(false);

      expect(call.isLocked).toBe(false);

      expect(call.order).toBe(4);

      expect(call.next.label).toBe('common_stepper_next_button_label');
      expect(call.next.isDisabled).toBe(true);

      expect(call.edit.label).toBe('common_stepper_modify_this_step');
    });

    describe('Private networks', () => {
      it.skip('should show spinner if private networks are pending', () => {
        (useGetRegionPrivateNetworks as Mock).mockImplementationOnce(() => ({
          data: undefined,
          isPending: true,
        }));

        ((OsdsSpinner as unknown) as Mock).mockImplementation(() => (
          <div data-testid="spinner"></div>
        ));

        const { getByTestId } = render(<NetworkStep />, { wrapper });

        expect(getByTestId('spinner')).toBeInTheDocument();
      });

      describe.skip('Private networks are not pending', () => {
        beforeEach(() => {
          (useGetRegionPrivateNetworks as Mock).mockImplementationOnce(() => ({
            data: [],
            isPending: false,
          }));
        });
        it('should not show spinner', () => {
          const { queryByTestId } = render(<NetworkStep />, { wrapper });

          expect(queryByTestId('spinner')).toBeNull();
        });
        describe('Field', () => {
          it('should show form field', async () => {
            const { queryByTestId } = render(<NetworkStep />, { wrapper });
            expect(queryByTestId('form-field')).toBeInTheDocument();
          });

          describe.skip('content', () => {
            // TODO continue for content of the form field

            it('should display the select', () => {
              render(<NetworkStep />, { wrapper });
              // expect(within(field).getByTestId('select')).toBeInTheDocument();
            });
          });
        });
      });
    });
  });
  describe.skip('Actions', () => {
    beforeAll(() => {
      (useGetFloatingIps as Mock).mockImplementationOnce(() => ({
        isPending: false,
      }));
    });

    describe('next', () => {
      describe.skip('render', () => {
        test('Next button should be disabled if addon is not set', () => {
          const { getByText } = render(<NetworkStep />, { wrapper });

          const nextButton = getByText('common_stepper_next_button_label');
          expect(
            nextButton.attributes.getNamedItem('disabled').value,
          ).toBeTruthy();
        });

        test('Next button should be enabled if addon is set', () => {
          const { result } = renderHook(() => useCreateStore());
          act(() => result.current.set.publicIp({} as TFloatingIp));

          const { getByText } = render(<NetworkStep />, { wrapper });

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
          act(() => result.current.set.publicIp({} as TFloatingIp));

          (useTrackStep as Mock).mockImplementationOnce(() => ({
            trackStep: trackStepSpy,
          }));

          const { getByText } = render(<NetworkStep />, { wrapper });

          const nextButton = getByText('common_stepper_next_button_label');

          act(() => nextButton.click());

          expect(trackStepSpy).toHaveBeenCalledWith(3);
        });
        test("Prepare networks's step on next click", () => {
          const { result } = renderHook(() => useCreateStore());
          act(() => {
            result.current.reset();
            result.current.set.publicIp({} as TFloatingIp);
          });

          const { getByText } = render(<NetworkStep />, { wrapper });

          const nextButton = getByText('common_stepper_next_button_label');
          //
          // act(()=>nextButton.click());
          //
          // expect([
          //   result.current.steps.get(StepsEnum.PUBLIC_IP).isChecked,
          //   result.current.steps.get(StepsEnum.PUBLIC_IP).isLocked,
          //   result.current.steps.get(StepsEnum.PRIVATE_NETWORK).isOpen
          // ]).toEqual([
          //   true,
          //   true,
          //   true
          // ]);
        });
      });
    });

    // TODO test edit
  });
});
