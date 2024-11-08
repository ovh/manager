import { describe, Mock, vi } from 'vitest';
import {
  StepComponent,
  TStepProps,
  useMe,
} from '@ovh-ux/manager-react-components';
import { render, renderHook, within } from '@testing-library/react';
import {
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { act } from 'react-dom/test-utils';
import React from 'react';
import { IpStep } from './IpStep';
import { wrapper } from '@/wrapperRenders';
import { useTracking } from '../hooks/useTracking';
import { StepsEnum, useCreateStore } from '@/pages/create/store';
import { useGetFloatingIps } from '@/api/hook/useFloatingIps';
import { TFloatingIp } from '@/api/data/floating-ips';

vi.mock('react-i18next', async () => {
  const { ...rest } = await vi.importActual('react-i18next');
  return {
    ...rest,
    useTranslation: vi.fn().mockImplementation((namespace: string) => ({
      t: vi.fn().mockImplementation((key: string) => `${namespace} | ${key}`),
    })),
  };
});

vi.mock('../hooks/useTracking', async () => ({
  useTracking: vi.fn().mockImplementation(() => ({ trackStep: vi.fn() })),
}));

vi.mock('@ovhcloud/ods-components/react', async () => {
  const {
    OsdsLink: ActualOsdsLink,
    OsdsSpinner: ActualOsdsSpinner,
    OsdsFormField: ActualOsdsFormField,
    OsdsSelect: ActualOsdsSelect,
    OsdsSelectOption: ActualOsdsSelectOption,
    OsdsMessage: ActualOsdsMessage,
    ...rest
  } = await vi.importActual('@ovhcloud/ods-components/react');

  const [
    OsdsLinkElem,
    OsdsSpinnerElem,
    OsdsFormFieldElem,
    OsdsSelectElem,
    OsdsSelectOptionElem,
    OsdsMessageElem,
  ] = [
    ActualOsdsLink as React.ElementType,
    ActualOsdsSpinner as React.ElementType,
    ActualOsdsFormField as React.ElementType,
    ActualOsdsSelect as React.ElementType,
    ActualOsdsSelectOption as React.ElementType,
    ActualOsdsMessage as React.ElementType,
  ];

  return {
    ...rest,
    OsdsSpinner: vi
      .fn()
      .mockImplementation(({ children, ...props }) => (
        <OsdsSpinnerElem {...props}>{children}</OsdsSpinnerElem>
      )),
    OsdsLink: vi
      .fn()
      .mockImplementation(({ props, children }) => (
        <OsdsLinkElem {...props}>{children}</OsdsLinkElem>
      )),
    OsdsFormField: vi.fn().mockImplementation(({ children, ...props }) => (
      <OsdsFormFieldElem {...props} data-testid="form-field">
        {children}
      </OsdsFormFieldElem>
    )),
    OsdsSelect: vi.fn().mockImplementation(({ children, ...props }) => (
      <OsdsSelectElem {...props} data-testid="osds-select">
        {children}
      </OsdsSelectElem>
    )),
    OsdsSelectOption: vi
      .fn()
      .mockImplementation(({ children, ...props }) => (
        <OsdsSelectOptionElem {...props}>{children}</OsdsSelectOptionElem>
      )),
    OsdsMessage: vi.fn().mockImplementation(({ children, ...props }) => (
      <OsdsMessageElem {...props} data-testid="osds-message">
        {children}
      </OsdsMessageElem>
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
    useCatalogPrice: vi
      .fn()
      .mockImplementation(() => ({ getFormattedHourlyCatalogPrice: vi.fn() })),
  };
});

vi.mock('@/api/hook/useFloatingIps', async () => {
  const { ...rest } = await vi.importActual('@/api/hook/useFloatingIps');
  return {
    ...rest,
    useGetFloatingIps: vi
      .fn()
      .mockImplementation(() => ({ data: undefined, isPending: true })),
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

const renderStep = () => render(<IpStep />, { wrapper });
const renderStore = () => renderHook(() => useCreateStore());

describe('IpStepStep', () => {
  beforeEach(() => {
    const { result } = renderStore();
    act(() => {
      result.current.reset();
      result.current.open(StepsEnum.IP);
    });
  });
  describe('should render', () => {
    beforeAll(() => {
      (useMe as Mock).mockImplementation(() => ({ me: undefined }));

      renderStep();
    });
    it('should render StepComponent with right props', () => {
      const { result } = renderStore();

      act(() => result.current.open(StepsEnum.IP));
      const { calls } = (StepComponent as Mock).mock;
      const call = calls[calls.length - 1][0] as TStepProps;

      expect(call.title).toBe(
        'load-balancer/create | octavia_load_balancer_create_floating_ip_title',
      );

      expect(call.isOpen).toBe(true);

      expect(call.isChecked).toBe(false);

      expect(call.isLocked).toBe(false);

      expect(call.order).toBe(3);

      expect(call.next.label).toBe(
        'pci-common | common_stepper_next_button_label',
      );
      expect(call.next.isDisabled).toBeUndefined();

      expect(call.edit.label).toBe(
        'pci-common | common_stepper_modify_this_step',
      );
    });

    it('should render intro', () => {
      const { getByText } = renderStep();

      expect(
        getByText(
          'load-balancer/create | octavia_load_balancer_create_floating_ip_intro',
        ),
      ).toBeInTheDocument();
    });

    describe('Floating ips', () => {
      it('should show spinner if floating ips are pending', () => {
        (useGetFloatingIps as Mock).mockImplementation(() => ({
          data: undefined,
          isPending: true,
        }));

        ((OsdsSpinner as unknown) as Mock).mockImplementationOnce(() => (
          <div data-testid="spinner"></div>
        ));

        const { getByTestId } = renderStep();

        expect(getByTestId('spinner')).toBeInTheDocument();
      });

      describe('Floating ips are not pending', () => {
        beforeEach(() => {
          (useGetFloatingIps as Mock).mockImplementation(() => ({
            isPending: false,
            isFetching: false,
          }));
        });
        it('should not show spinner', () => {
          ((OsdsSpinner as unknown) as Mock).mockReturnValue(
            <span data-testid="spinner"></span>,
          );
          const { queryByTestId } = renderStep();

          expect(queryByTestId('spinner')).not.toBeInTheDocument();
        });
        describe('Field', () => {
          beforeEach(() => {
            (useGetFloatingIps as Mock).mockReturnValueOnce({
              isPending: false,
              isFetching: false,
            });
          });
          it('should show form field', () => {
            const { queryByTestId } = renderStep();

            expect(queryByTestId('form-field')).toBeInTheDocument();
          });

          describe('content', () => {
            it('should have the right label', () => {
              ((OsdsSelect as unknown) as Mock).mockImplementationOnce(() => (
                <></>
              ));
              const { getByTestId } = renderStep();

              expect(
                within(getByTestId('form-field')).getByText(
                  'load-balancer/create | octavia_load_balancer_create_floating_ip_field',
                ),
              ).toBeInTheDocument();
            });

            describe('select', () => {
              it('should display the select', () => {
                const { getByTestId } = renderStep();
                expect(
                  within(getByTestId('form-field')).getByTestId('osds-select'),
                ).toBeInTheDocument();
              });

              it('value should be the id of the floating ip if it is set', () => {
                const { result } = renderStore();
                act(() => {
                  result.current.set.publicIp({ id: 'test' } as TFloatingIp);
                });
                const { getByTestId } = renderStep();

                expect(
                  getByTestId('osds-select').attributes.getNamedItem('value')
                    .value,
                ).toBe('test');
              });

              it('value should be undefined if the floating is not set', () => {
                const { getByTestId } = renderStep();

                expect(
                  getByTestId('osds-select').attributes.getNamedItem('value'),
                ).toBeNull();
              });

              it('should display the placeholder', () => {
                const { getByTestId } = renderStep();

                expect(
                  within(getByTestId('osds-select')).getByText(
                    'load-balancer/create | octavia_load_balancer_create_floating_ip_field',
                  ),
                ).toBeInTheDocument();
              });

              describe('Options', () => {
                beforeEach(() => {
                  ((OsdsSelectOption as unknown) as Mock).mockReset();
                });
                it('should show the create as the first option', () => {
                  renderStep();

                  const {
                    calls,
                  } = ((OsdsSelectOption as unknown) as Mock).mock;

                  const call = calls[0][0] as {
                    value: string;
                    children: string;
                  };

                  expect(call.value).toBe('create');
                  expect(call.children).toBe(
                    'load-balancer/create | octavia_load_balancer_create_floating_ip_field_new_floating_ip',
                  );
                });

                it('should show the no ip as the second option', () => {
                  renderStep();

                  const {
                    calls,
                  } = ((OsdsSelectOption as unknown) as Mock).mock;

                  const call = calls[1][0] as {
                    value: string;
                    children: string;
                  };

                  expect(call.value).toBe('none');
                  expect(call.children).toBe(
                    'load-balancer/create | octavia_load_balancer_create_floating_ip_field_no_floating_ip',
                  );
                });

                it('should show the select with the right options', () => {
                  (useGetFloatingIps as Mock).mockImplementationOnce(() => ({
                    list: [
                      { id: '1', ip: 'ip' },
                      { id: '1', ip: 'ip' },
                    ] as TFloatingIp[],
                    isPending: false,
                  }));
                });
              });
            });

            describe('Messages', () => {
              describe('create', () => {
                it("should not show the message if the selected ip isn't create", () => {
                  const { queryByTestId } = renderStep();

                  expect(queryByTestId('osds-message')).not.toBeInTheDocument();
                });

                describe('selected ip is create', () => {
                  beforeEach(() => {
                    const { result } = renderStore();
                    act(() => {
                      result.current.set.publicIp({
                        id: 'create',
                      } as TFloatingIp);
                    });
                  });
                  it('should show the message', () => {
                    const { getByTestId } = renderStep();

                    expect(getByTestId('osds-message')).toBeInTheDocument();

                    expect(
                      getByTestId('osds-message').attributes.getNamedItem(
                        'color',
                      ).value,
                    ).toBe('info');
                  });

                  it('should display the info message with the right content', () => {
                    // TODO extra checks
                    const { getByTestId } = renderStep();

                    const messageElement = getByTestId('osds-message');

                    expect(messageElement).toMatchSnapshot();
                  });
                });
              });
              describe('none', () => {
                it("should not show the message if the selected ip isn't none", () => {
                  const { queryByTestId } = renderStep();

                  expect(queryByTestId('osds-message')).not.toBeInTheDocument();
                });

                describe('selected ip is none', () => {
                  beforeEach(() => {
                    const { result } = renderStore();
                    act(() => {
                      result.current.set.publicIp({
                        id: 'none',
                      } as TFloatingIp);
                    });
                  });
                  it('should show the message', () => {
                    const { getByTestId } = renderStep();

                    expect(getByTestId('osds-message')).toBeInTheDocument();

                    expect(
                      getByTestId('osds-message').attributes.getNamedItem(
                        'color',
                      ).value,
                    ).toBe('warning');
                  });

                  it('should display the warning message with the right content', () => {
                    // TODO extra checks
                    const { getByTestId } = renderStep();

                    const messageElement = getByTestId('osds-message');

                    expect(messageElement).toMatchSnapshot();
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  describe('Actions', () => {
    beforeEach(() => {
      const { result } = renderStore();
      act(() => {
        result.current.set.publicIp({ id: 'create' } as TFloatingIp);
      });
    });
    describe('next', () => {
      describe('click', () => {
        it('Should track on next click', async () => {
          const trackStepSpy = vi.fn();

          (useTracking as Mock).mockImplementation(() => ({
            trackStep: trackStepSpy,
          }));

          const { getByText } = renderStep();

          const nextButton = getByText(
            'pci-common | common_stepper_next_button_label',
          );

          act(() => nextButton.click());

          expect(trackStepSpy).toHaveBeenCalledWith(3);
        });
        test("Prepare network's step on next click", () => {
          const { result } = renderStore();

          const { getByText } = renderStep();

          const nextButton = getByText(
            'pci-common | common_stepper_next_button_label',
          );

          const { check, lock, open } = { ...result.current };

          result.current.check = vi.fn();
          result.current.lock = vi.fn();
          result.current.open = vi.fn();

          act(() => nextButton.click());

          expect(result.current.check).toHaveBeenCalledWith(StepsEnum.IP);
          expect(result.current.lock).toHaveBeenCalledWith(StepsEnum.IP);
          expect(result.current.open).toHaveBeenCalledWith(StepsEnum.NETWORK);

          result.current.check = check;
          result.current.lock = lock;
          result.current.open = open;
        });
      });
    });

    describe('edit', () => {
      describe('render', () => {
        it('should not display if step is not checked', () => {
          const { queryByText } = renderStep();

          const editButton = queryByText(
            'pci-common | common_stepper_modify_this_step',
          );
          expect(editButton).not.toBeInTheDocument();
        });
        it('should have the right label', () => {
          const { result } = renderStore();
          act(() => result.current.lock(StepsEnum.IP));

          const { queryByText } = renderStep();

          const editButton = queryByText(
            'pci-common | common_stepper_modify_this_step',
          );
          expect(editButton).toBeInTheDocument();
        });
      });

      describe('click', () => {
        it('should prepare steps on click', () => {
          const { result } = renderStore();
          act(() => result.current.lock(StepsEnum.IP));

          const { unlock, uncheck, open, reset } = { ...result.current };

          result.current.unlock = vi.fn();
          result.current.uncheck = vi.fn();
          result.current.open = vi.fn();
          result.current.reset = vi.fn();

          const { getByText } = renderStep();

          const editButton = getByText(
            'pci-common | common_stepper_modify_this_step',
          );

          act(() => {
            editButton.click();
          });

          // expect(result.current.unlock).toHaveBeenCalledWith(StepsEnum.IP);
          // expect(result.current.uncheck).toHaveBeenCalledWith(StepsEnum.IP);
          // expect(result.current.open).toHaveBeenCalledWith(StepsEnum.IP);
          // expect(result.current.reset).toHaveBeenCalledWith(
          //   StepsEnum.NETWORK,
          //   StepsEnum.INSTANCE,
          //   StepsEnum.NAME,
          // );

          result.current.unlock = unlock;
          result.current.uncheck = uncheck;
          result.current.open = open;
          result.current.reset = reset;
        });
      });
    });
  });
});
