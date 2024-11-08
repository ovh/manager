import { describe, Mock, vi } from 'vitest';
import {
  StepComponent,
  TStepProps,
  useMe,
} from '@ovh-ux/manager-react-components';
import { render, renderHook } from '@testing-library/react';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { SizeStep } from './SizeStep';
import { wrapper } from '@/wrapperRenders';
import { useGetAddons } from '@/api/hook/useAddons';
import { PRODUCT_LINK } from '@/constants';
import SizeInputComponent from './input/SizeInput.component';
import { useTracking } from '../../hooks/useTracking';
import { StepsEnum, TAddon, useCreateStore } from '@/pages/create/store';

vi.mock('react-i18next', async () => {
  const { ...rest } = await vi.importActual('react-i18next');
  return {
    ...rest,
    useTranslation: vi.fn().mockImplementation((namespace: string) => ({
      t: vi.fn().mockImplementation((key: string) => `${namespace} | ${key}`),
    })),
  };
});

vi.mock('../../hooks/useTracking', async () => ({
  useTracking: vi.fn().mockImplementation(() => ({ trackStep: vi.fn() })),
}));

vi.mock('@ovhcloud/ods-components/react', async () => {
  const {
    OsdsSpinner: ActualOsdsSpinner,
    OsdsLink: ActualOsdsLink,
    OsdsText: ActualOsdsText,
    ...rest
  } = await vi.importActual('@ovhcloud/ods-components/react');
  const [OsdsSpinnerElem, OsdsLinkElem, OsdsTextElem] = [
    ActualOsdsSpinner as React.ElementType,
    ActualOsdsLink as React.ElementType,
    ActualOsdsText as React.ElementType,
  ];
  return {
    ...rest,
    OsdsSpinner: vi
      .fn()
      .mockImplementation(({ children, ...props }) => (
        <OsdsSpinnerElem {...props}>{children}</OsdsSpinnerElem>
      )),
    OsdsLink: vi.fn().mockImplementation(({ children, ...props }) => (
      <OsdsLinkElem {...props} data-testid="osds-link">
        {children}
      </OsdsLinkElem>
    )),
    OsdsText: vi
      .fn()
      .mockImplementation(({ children, ...props }) => (
        <OsdsTextElem {...props}>{children}</OsdsTextElem>
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

vi.mock('./input/SizeInput.component', async () => {
  const { default: ActualDefault, ...rest } = await vi.importActual(
    './input/SizeInput.component',
  );
  return {
    ...rest,
    default: vi
      .fn()
      .mockImplementation(ActualDefault as typeof SizeInputComponent),
  };
});

const renderStep = () => render(<SizeStep />, { wrapper });
const renderStore = () => renderHook(() => useCreateStore());

describe('SizeStep', () => {
  beforeEach(() => {
    const { result } = renderStore();
    act(() => {
      result.current.reset();
      result.current.open(StepsEnum.SIZE);
    });
  });
  describe('should render', () => {
    beforeEach(() => {
      (useMe as Mock).mockImplementation(() => ({ me: undefined }));
      (StepComponent as Mock).mockImplementationOnce(({ children }) => (
        <div data-testid="step-component">{children}</div>
      ));
    });
    it('should render StepComponent with right props', () => {
      renderStep();
      const call = (StepComponent as Mock).mock.calls[0][0] as TStepProps;

      expect(call.title).toBe(
        'load-balancer/create | octavia_load_balancer_create_size_title',
      );

      expect(call.isOpen).toBe(true);

      expect(call.isChecked).toBe(false);

      expect(call.isLocked).toBe(false);

      expect(call.order).toBe(1);

      expect(call.next.label).toBe(
        'pci-common | common_stepper_next_button_label',
      );
      expect(call.next.isDisabled).toBe(true);

      expect(call.edit.label).toBe(
        'pci-common | common_stepper_modify_this_step',
      );
    });

    it('should render intro', () => {
      const { getByText } = renderStep();
      expect(
        getByText(
          'load-balancer/create | octavia_load_balancer_create_size_intro',
        ),
      ).toBeInTheDocument();
      expect(
        getByText(
          'load-balancer/create | octavia_load_balancer_create_size_intro_link',
        ),
      ).toBeInTheDocument();
    });

    describe('Product link', () => {
      it('should render ovhSubsidiary product link if found', () => {
        (useMe as Mock).mockImplementation(() => ({
          me: { ovhSubsidiary: 'FR' },
        }));
        const { getByTestId } = renderStep();

        expect(
          getByTestId('osds-link').attributes.getNamedItem('href').value,
        ).toBe(PRODUCT_LINK.FR);
      });

      it('should render default product link if not found', () => {
        (useMe as Mock).mockImplementation(() => ({
          me: undefined,
        }));
        const { getByTestId } = renderStep();

        expect(
          getByTestId('osds-link').attributes.getNamedItem('href').value,
        ).toBe(PRODUCT_LINK.DEFAULT);
      });
    });

    describe('Addons', () => {
      it('should show spinner if addons are pending', () => {
        (useGetAddons as Mock).mockImplementationOnce(() => ({
          data: undefined,
          isPending: true,
        }));

        ((OsdsSpinner as unknown) as Mock).mockImplementationOnce(() => (
          <div data-testid="spinner"></div>
        ));

        const { getByTestId } = renderStep();

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

        const { getByTestId } = renderStep();

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
          const { getByText } = renderStep();

          const nextButton = getByText(
            'pci-common | common_stepper_next_button_label',
          );
          expect(
            nextButton.attributes.getNamedItem('disabled').value,
          ).toBeTruthy();
        });

        test('Next button should be enabled if addon is set', () => {
          const { result } = renderStore();
          act(() => result.current.set.addon({} as TAddon));

          const { getByText } = renderStep();

          const nextButton = getByText(
            'pci-common | common_stepper_next_button_label',
          );
          expect(
            nextButton.attributes.getNamedItem('disabled')?.value,
          ).toBeFalsy();
        });
      });
      describe('click', () => {
        it('Should track on next click', async () => {
          const trackStepSpy = vi.fn();

          const { result } = renderStore();
          act(() => result.current.set.addon({} as TAddon));

          (useTracking as Mock).mockImplementation(() => ({
            trackStep: trackStepSpy,
          }));

          const { getByText } = renderStep();

          const nextButton = getByText(
            'pci-common | common_stepper_next_button_label',
          );

          act(() => nextButton.click());

          expect(trackStepSpy).toHaveBeenCalledWith(1);
        });
        test("Prepare region's step on next click", () => {
          const { result } = renderStore();
          act(() => {
            result.current.set.addon({} as TAddon);
          });

          const { getByText } = renderStep();

          const nextButton = getByText(
            'pci-common | common_stepper_next_button_label',
          );

          const { check, lock, open } = { ...result.current };

          result.current.check = vi.fn();
          result.current.lock = vi.fn();
          result.current.open = vi.fn();

          act(() => nextButton.click());

          expect(result.current.check).toHaveBeenCalledWith(StepsEnum.SIZE);
          expect(result.current.lock).toHaveBeenCalledWith(StepsEnum.SIZE);
          expect(result.current.open).toHaveBeenCalledWith(StepsEnum.REGION);

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
          act(() => result.current.lock(StepsEnum.SIZE));

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

          const { unlock, uncheck, open, reset } = { ...result.current };

          act(() => result.current.lock(StepsEnum.SIZE));

          result.current.unlock = vi.fn();
          result.current.uncheck = vi.fn();
          result.current.open = vi.fn();
          result.current.reset = vi.fn();

          const { getByText } = renderStep();

          const editButton = getByText(
            'pci-common | common_stepper_modify_this_step',
          );

          act(() => editButton.click());

          expect(result.current.unlock).toHaveBeenCalledWith(StepsEnum.SIZE);
          expect(result.current.uncheck).toHaveBeenCalledWith(StepsEnum.SIZE);
          expect(result.current.open).toHaveBeenCalledWith(StepsEnum.SIZE);
          expect(result.current.reset).toHaveBeenCalledWith(
            StepsEnum.REGION,
            StepsEnum.IP,
            StepsEnum.NETWORK,
            StepsEnum.INSTANCE,
            StepsEnum.NAME,
          );

          result.current.unlock = unlock;
          result.current.uncheck = uncheck;
          result.current.open = open;
          result.current.reset = reset;
        });
      });
    });
  });
});
