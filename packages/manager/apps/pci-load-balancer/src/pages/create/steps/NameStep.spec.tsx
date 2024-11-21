import { describe, Mock, vi } from 'vitest';
import { StepComponent, TStepProps } from '@ovh-ux/manager-react-components';
import { fireEvent, render, renderHook, within } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import React from 'react';
import { wrapper } from '@/wrapperRenders';
import { NameStep } from './NameStep';
import { StepsEnum, TAddon, useCreateStore } from '@/pages/create/store';
import { TRegion } from '@/api/hook/useRegions';
import { useCreateActions } from '../hooks/useCreateActions';

vi.mock('../hooks/useCreateActions', async () => {
  const { ...rest } = await vi.importActual('../hooks/useCreateActions');
  return {
    ...rest,
    useCreateActions: vi.fn().mockImplementation(() => ({
      create: vi.fn(),
      cancel: vi.fn(),
    })),
  };
});

vi.mock('react-i18next', async () => {
  const { ...rest } = await vi.importActual('react-i18next');
  return {
    ...rest,
    useTranslation: vi.fn().mockImplementation((namespace: string) => ({
      t: vi.fn().mockImplementation((key: string) => `${namespace} | ${key}`),
    })),
  };
});

vi.mock('react-router-dom', async () => {
  const { ...rest } = await vi.importActual('react-router-dom');

  return {
    ...rest,
    useNavigate: vi.fn().mockReturnValue(vi.fn()),
  };
});

vi.mock('../hooks/useTracking', async () => {
  const { ...rest } = await vi.importActual('../hooks/useTracking');

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
  const {
    OsdsFormField: ActualOsdsFormField,
    OsdsInput: ActualOsdsInput,
    ...rest
  } = await vi.importActual('@ovhcloud/ods-components/react');
  const [OsdsFormFieldElem, OsdsInputElem] = [
    ActualOsdsFormField as React.ElementType,
    ActualOsdsInput as React.ElementType,
  ];
  return {
    ...rest,
    OsdsFormField: vi.fn().mockImplementation(({ children, ...props }) => (
      <OsdsFormFieldElem {...props} data-testid="osds-field">
        {children}
      </OsdsFormFieldElem>
    )),
    OsdsInput: vi
      .fn()
      .mockImplementation(({ ...props }) => (
        <OsdsInputElem {...props} data-testid="osds-input" />
      )),
  };
});

const renderStep = () => render(<NameStep />, { wrapper });
const renderStore = () => renderHook(() => useCreateStore());

describe('NameStep', () => {
  beforeEach(() => {
    const { result } = renderStore();
    act(() => {
      result.current.reset();
      result.current.open(StepsEnum.NAME);
    });
  });
  describe('render', () => {
    it('should render NameComponent with right props', () => {
      renderStep();

      const call = (StepComponent as Mock).mock.calls[0][0] as TStepProps;

      expect(call.title).toBe(
        'load-balancer/create | octavia_load_balancer_create_name_field_label',
      );

      expect(call.isOpen).toBe(true);

      expect(call.isChecked).toBe(false);

      expect(call.isLocked).toBe(false);

      expect(call.order).toBe(6);

      expect(call.next).toBe(undefined);
    });
  });

  describe('Field', () => {
    it('should render field', () => {
      const { queryByTestId } = renderStep();

      expect(queryByTestId('osds-field')).toBeInTheDocument();
    });

    describe('error', () => {
      it('should not show if name is valid', () => {
        const { result } = renderStore();
        act(() => result.current.set.name('load-balancer-name'));

        const { queryByTestId } = renderStep();

        expect(queryByTestId('osds-field')).toHaveAttribute('error', '');
      });

      it('should display the right message if name does not match regex', () => {
        const { result } = renderStore();
        act(() => result.current.set.name('namé'));

        const { queryByTestId } = renderStep();

        expect(queryByTestId('osds-field')).toHaveAttribute(
          'error',
          'pci-common | common_field_error_pattern',
        );
      });

      it('should display the right message if name is too long', () => {
        const { result } = renderStore();
        act(() => result.current.set.name('a'.padStart(71, '_')));

        const { queryByTestId } = renderStep();

        expect(queryByTestId('osds-field')).toHaveAttribute(
          'error',
          'pci-common | common_field_error_maxlength',
        );
      });

      it('should display length error if name is too long and does not match regex', () => {
        const { result } = renderStore();
        act(() => result.current.set.name(`${'a'.padStart(71, '_')}é`));

        const { queryByTestId } = renderStep();

        expect(queryByTestId('osds-field')).toHaveAttribute(
          'error',
          'pci-common | common_field_error_maxlength',
        );
      });
    });

    describe('label', () => {
      it('should display the right label', () => {
        const { queryByTestId } = renderStep();
        expect(
          within(queryByTestId('osds-field')).queryByText(
            'load-balancer/create | octavia_load_balancer_create_name_field_label',
          ),
        ).toBeInTheDocument();
      });
    });

    describe('hint', () => {
      it('should display the right hint', () => {
        const { queryByTestId } = renderStep();
        expect(
          within(queryByTestId('osds-field')).queryByText(
            'load-balancer/create | octavia_load_balancer_create_name_field_help',
          ),
        ).toBeInTheDocument();
      });
    });

    describe('input', () => {
      it('should render input', () => {
        const { queryByTestId } = renderStep();
        expect(
          within(queryByTestId('osds-field')).getByTestId('osds-input'),
        ).toBeInTheDocument();
      });

      test('value should be equal to store.name', () => {
        const { result } = renderStore();
        act(() => result.current.set.name('value'));
        const { queryByTestId } = renderStep();
        const input = within(queryByTestId('osds-field')).getByTestId(
          'osds-input',
        );
        expect(input).toHaveValue('value');
      });

      it('should call store.set.name on input change', () => {
        const { result } = renderStore();
        const { queryByTestId } = renderStep();
        const input = within(queryByTestId('osds-field')).getByTestId(
          'osds-input',
        );

        const { name } = result.current.set;
        result.current.set.name = vi.fn();

        act(() => {
          fireEvent(
            input,
            new CustomEvent('odsValueChange', {
              detail: { value: 'new value' },
            }),
          );
        });

        expect(result.current.set.name).toHaveBeenCalledWith('new value');
        result.current.set.name = name;
      });

      describe('error', () => {
        it('should not have error class if name is valid', () => {
          const { result } = renderStore();
          act(() => result.current.set.name('load-balancer-name'));
          const { queryByTestId } = renderStep();
          const input = within(queryByTestId('osds-field')).getByTestId(
            'osds-input',
          );
          expect(input).toHaveAttribute(
            'class',
            'border-color-[var(--ods-color-default-200)] bg-white',
          );
        });

        it("should have error class if name doesn't match regex", () => {
          const { result } = renderStore();
          act(() => result.current.set.name('namé'));
          const { queryByTestId } = renderStep();
          const input = within(queryByTestId('osds-field')).getByTestId(
            'osds-input',
          );
          expect(input).toHaveAttribute(
            'class',
            'bg-red-100 border-red-500 text-red-500 focus:text-red-500',
          );
        });

        it('should have error class if name is too long', () => {
          const { result } = renderStore();
          act(() => result.current.set.name('a'.padStart(71, '_')));
          const { queryByTestId } = renderStep();
          const input = within(queryByTestId('osds-field')).getByTestId(
            'osds-input',
          );
          expect(input).toHaveAttribute(
            'class',
            'bg-red-100 border-red-500 text-red-500 focus:text-red-500',
          );
        });
      });
    });
  });

  describe('Call to actions', () => {
    describe.skip('render', () => {
      describe('user did not click create yet', () => {
        it('should display create button', () => {
          const { queryByText } = renderStep();
          expect(
            queryByText(
              'load-balancer/create | octavia_load_balancer_create_title',
            ),
          ).toBeInTheDocument();
        });
        it('should display cancel button', () => {
          const { queryByText } = renderStep();
          expect(queryByText('pci-common | common_cancel')).toBeInTheDocument();
        });
      });
      describe('user clicked create', () => {
        let create;
        beforeEach(() => {
          const { result } = renderStore();
          act(() => {
            result.current.set.region({ name: 'name' } as TRegion);
            result.current.set.addon({ code: 'code' } as TAddon);
          });

          create = result.current.create;
          result.current.create = vi.fn();
        });
        afterEach(() => {
          const { result } = renderStore();
          result.current.create = create;
        });

        it('should not display create button', () => {
          const { queryByText } = renderStep();
          act(() =>
            queryByText(
              'load-balancer/create | octavia_load_balancer_create_title',
            ).click(),
          );
          expect(
            queryByText(
              'load-balancer/create | octavia_load_balancer_create_title',
            ),
          ).not.toBeInTheDocument();
        });

        it('should not display cancel button', () => {
          const { queryByText } = renderStep();
          act(() =>
            queryByText(
              'load-balancer/create | octavia_load_balancer_create_title',
            ).click(),
          );
          expect(
            queryByText('pci-common | common_cancel'),
          ).not.toBeInTheDocument();
        });
      });
    });

    describe('actions', () => {
      describe('create', () => {
        it('should call create', () => {
          const createSpy = vi.fn();
          (useCreateActions as Mock).mockImplementationOnce(() => ({
            create: createSpy,
          }));

          const { result } = renderStore();

          act(() => {
            result.current.set.addon({ code: 'code' } as TAddon);
            result.current.set.region({ name: 'name' } as TRegion);
            result.current.set.name('');
          });

          const { queryByText } = renderStep();

          act(() =>
            queryByText(
              'load-balancer/create | octavia_load_balancer_create_title',
            ).click(),
          );

          expect(createSpy).toHaveBeenCalled();
        });
      });

      describe.skip('cancel', () => {
        it('should call cancel', () => {
          const cancelSpy = vi.fn();

          const { queryByText } = renderStep();

          act(() => queryByText('pci-common | common_cancel').click());

          expect(cancelSpy).toHaveBeenCalled();
        });
      });
    });
  });
});
