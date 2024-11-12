import { describe, Mock, vi } from 'vitest';
import { StepComponent, TStepProps } from '@ovh-ux/manager-react-components';
import { render, renderHook, within } from '@testing-library/react';
import { OsdsSelect, OsdsSpinner } from '@ovhcloud/ods-components/react';
import { act } from 'react-dom/test-utils';
import React from 'react';
import { NetworkStep } from './NetworkStep';
import { wrapper } from '@/wrapperRenders';
import { useTracking } from '@/pages/create/hooks/useTracking';
import { StepsEnum, useCreateStore } from '@/pages/create/store';
import { useGetFloatingIps } from '@/api/hook/useFloatingIps';
import { TFloatingIp } from '@/api/data/floating-ips';
import { useGetRegionPrivateNetworks } from '@/api/hook/useNetwork';
import { TSubnet } from '@/api/data/network';

vi.mock('react-i18next', async () => {
  const { ...rest } = await vi.importActual('react-i18next');
  return {
    ...rest,
    useTranslation: vi.fn().mockImplementation((namespace: string) => ({
      t: vi.fn().mockImplementation((key: string) => `${namespace} | ${key}`),
    })),
  };
});

vi.mock('@/pages/create/hooks/useTracking', async () => ({
  useTracking: vi.fn().mockImplementation(() => ({ trackStep: vi.fn() })),
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

const renderStep = (subnetsList: TSubnet[] = [], isLoading = false) =>
  render(<NetworkStep subnetsList={subnetsList} isLoading={isLoading} />, {
    wrapper,
  });
const renderStore = () => renderHook(() => useCreateStore());

describe('NetworkStepStep', () => {
  beforeEach(() => {
    const { result } = renderStore();
    act(() => {
      result.current.reset();
      result.current.open(StepsEnum.NETWORK);
    });
  });
  describe('should render', () => {
    beforeAll(() => {
      (StepComponent as Mock).mockImplementationOnce(({ children }) => (
        <div>{children}</div>
      ));

      renderStep();
    });
    it('should render StepComponent with right props', () => {
      const { calls } = (StepComponent as Mock).mock;
      const call = calls[calls.length - 1][0] as TStepProps;

      expect(call.title).toBe(
        'load-balancer/create | octavia_load_balancer_create_private_network_title',
      );

      expect(call.isOpen).toBe(true);

      expect(call.isChecked).toBe(false);

      expect(call.isLocked).toBe(false);

      expect(call.order).toBe(4);

      expect(call.next.label).toBe(
        'pci-common | common_stepper_next_button_label',
      );
      expect(call.next.isDisabled).toBe(true);

      expect(call.edit.label).toBe(
        'pci-common | common_stepper_modify_this_step',
      );
    });

    it('should display intro text', () => {
      const { getByText } = renderStep();
      expect(
        getByText(
          'load-balancer/create | octavia_load_balancer_create_private_network_intro',
        ),
      ).toBeInTheDocument();
    });

    describe('Private networks', () => {
      it('should show spinner if private networks are pending', () => {
        (useGetRegionPrivateNetworks as Mock).mockImplementationOnce(() => ({
          data: undefined,
          isPending: true,
        }));

        ((OsdsSpinner as unknown) as Mock).mockImplementation(() => (
          <div data-testid="spinner"></div>
        ));

        const { getByTestId } = renderStep();

        expect(getByTestId('spinner')).toBeInTheDocument();
      });

      describe('Private networks are not pending', () => {
        it.skip('should not show spinner', () => {
          const { queryByTestId } = renderStep();

          // expect(queryByTestId('spinner')).toBeNull();
        });
        describe('Private network Field', () => {
          it('should show form field', async () => {
            const { queryByTestId } = renderStep();
            expect(queryByTestId('form-field')).toBeInTheDocument();
          });

          describe('content', () => {
            let field: HTMLElement;
            beforeAll(() => {
              const { getByTestId } = renderStep();
              field = getByTestId('form-field');
            });

            it('should display label', () => {
              ((OsdsSelect as unknown) as Mock).mockImplementation(() => <></>);
              renderStep();

              expect(
                within(field).getByText(
                  'load-balancer/create | octavia_load_balancer_create_private_network_field',
                ),
              );
            });

            it.skip('should display the select', () => {
              ((OsdsSelect as unknown) as Mock).mockImplementation(() => (
                <div data-testid="select"></div>
              ));
              const { debug } = renderStep();
              debug();
              expect(within(field).getByTestId('select')).toBeInTheDocument();
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
          const { getByText } = renderStep();

          const nextButton = getByText('common_stepper_next_button_label');
          expect(
            nextButton.attributes.getNamedItem('disabled').value,
          ).toBeTruthy();
        });

        test('Next button should be enabled if addon is set', () => {
          const { result } = renderStore();
          act(() => result.current.set.publicIp({} as TFloatingIp));

          const { getByText } = renderStep();

          const nextButton = getByText('common_stepper_next_button_label');
          expect(
            nextButton.attributes.getNamedItem('disabled')?.value,
          ).toBeFalsy();
        });
      });
      describe('click', () => {
        it('Should track on next click', async () => {
          const trackStepSpy = vi.fn();

          const { result } = renderStore();
          act(() => result.current.set.publicIp({} as TFloatingIp));

          (useTracking as Mock).mockImplementationOnce(() => ({
            trackStep: trackStepSpy,
          }));

          const { getByText } = renderStep();

          const nextButton = getByText('common_stepper_next_button_label');

          act(() => nextButton.click());

          expect(trackStepSpy).toHaveBeenCalledWith(3);
        });
        test("Prepare networks's step on next click", () => {
          const { result } = renderStore();
          act(() => {
            result.current.reset();
            result.current.set.publicIp({} as TFloatingIp);
          });

          const { getByText } = renderStep();

          const nextButton = getByText('common_stepper_next_button_label');
        });
      });
    });
  });
});
