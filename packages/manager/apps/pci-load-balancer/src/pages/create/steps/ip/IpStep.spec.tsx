import { describe, Mock, vi } from 'vitest';
import { StepComponent, TStepProps } from '@ovh-ux/manager-react-components';
import { render, renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import React from 'react';
import { IpStep, TIpStepProps } from './IpStep';
import { wrapper } from '@/wrapperRenders';
import { useTracking } from '../../hooks/useTracking';
import { StepsEnum, useCreateStore } from '@/pages/create/store';
import { FloatingIpSelectionId } from '@/types/floating.type';

vi.mock('./IpStepMessages', async () => ({
  IpStepMessages: vi
    .fn()
    .mockImplementation(({ ...props }) => (
      <div data-testid="step-messages" {...props}></div>
    )),
}));

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
    useCatalogPrice: vi.fn().mockImplementation(() => ({
      getFormattedHourlyCatalogPrice: vi
        .fn()
        .mockImplementation((param) => param),
    })),
  };
});

const renderStep = (
  { ovhSubsidiary = '', projectId = 'projectId' }: Partial<TIpStepProps> = {
    ovhSubsidiary: '',
    projectId: 'projectId',
  },
) =>
  render(<IpStep ovhSubsidiary={ovhSubsidiary} projectId={projectId} />, {
    wrapper,
  });

const renderStore = () => renderHook(() => useCreateStore());

describe('IpStep', () => {
  beforeEach(() => {
    const { result } = renderStore();
    act(() => {
      result.current.reset();
      result.current.open(StepsEnum.IP);
    });
  });
  describe('should render', () => {
    it('should render StepComponent with right props', () => {
      renderStep();
      const { calls } = (StepComponent as Mock).mock;
      const call = calls[calls.length - 1][0] as TStepProps;

      expect(call.title).toBe(
        'load-balancer/create,pci-common | octavia_load_balancer_create_floating_ip_title',
      );

      expect(call.isOpen).toBe(true);

      expect(call.isChecked).toBe(false);

      expect(call.isLocked).toBe(false);

      expect(call.order).toBe(3);

      expect(call.next.label).toBe(
        'load-balancer/create,pci-common | pci-common:common_stepper_next_button_label',
      );
      expect(call.next.isDisabled).toBe(true);

      expect(call.edit.label).toBe(
        'load-balancer/create,pci-common | pci-common:common_stepper_modify_this_step',
      );
    });

    it('should render intro', () => {
      const { getByText } = renderStep();

      expect(
        getByText(
          'load-balancer/create,pci-common | octavia_load_balancer_create_floating_ip_intro',
        ),
      ).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    beforeEach(() => {
      const { result } = renderStore();
      act(() => {
        result.current.set.publicIp(FloatingIpSelectionId.NEW);
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
            'load-balancer/create,pci-common | pci-common:common_stepper_next_button_label',
          );

          act(() => nextButton.click());

          expect(trackStepSpy).toHaveBeenCalledWith(3);
        });
        test("Prepare network's step on next click", () => {
          const { result } = renderStore();

          const { getByText } = renderStep();

          const nextButton = getByText(
            'load-balancer/create,pci-common | pci-common:common_stepper_next_button_label',
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
            'load-balancer/create,pci-common | pci-common:common_stepper_modify_this_step',
          );
          expect(editButton).not.toBeInTheDocument();
        });
        it('should have the right label', () => {
          const { result } = renderStore();
          act(() => result.current.lock(StepsEnum.IP));

          const { queryByText } = renderStep();

          const editButton = queryByText(
            'load-balancer/create,pci-common | pci-common:common_stepper_modify_this_step',
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
            'load-balancer/create,pci-common | pci-common:common_stepper_modify_this_step',
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
