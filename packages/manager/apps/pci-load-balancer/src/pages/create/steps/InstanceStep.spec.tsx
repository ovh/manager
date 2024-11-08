import { describe, Mock, vi } from 'vitest';
import { render, renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import {
  StepComponent,
  useMe,
  TStepProps,
} from '@ovh-ux/manager-react-components';
import { OsdsLink, OsdsMessage } from '@ovhcloud/ods-components/react';
import React from 'react';
import { StepsEnum, useCreateStore } from '@/pages/create/store';
import { wrapper } from '@/wrapperRenders';
import { InstanceStep } from '@/pages/create/steps/InstanceStep';
import { LOAD_BALANCER_CREATION_TRACKING, PRODUCT_LINK } from '@/constants';
import { InstanceTable } from '@/components/create/InstanceTable.component';
import { useTracking } from '@/pages/create/hooks/useTracking';

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
  useTracking: vi
    .fn()
    .mockImplementation(() => ({ trackStep: vi.fn(), trackClick: vi.fn() })),
}));

vi.mock('@ovh-ux/manager-react-components', async () => {
  const { StepComponent: ActualStepComponent, ...rest } = await vi.importActual(
    '@ovh-ux/manager-react-components',
  );
  return {
    ...rest,
    useMe: vi.fn().mockImplementation(() => ({ me: undefined })),
    StepComponent: vi
      .fn()
      .mockImplementation(ActualStepComponent as typeof StepComponent),
  };
});

vi.mock('@/components/create/InstanceTable.component', async () => {
  const { InstanceTable: ActualInstanceLabel, ...rest } = await vi.importActual(
    '@/components/create/InstanceTable.component',
  );
  return {
    ...rest,
    InstanceTable: vi
      .fn()
      .mockImplementation(ActualInstanceLabel as typeof InstanceTable),
  };
});

vi.mock('@ovhcloud/ods-components/react', async () => {
  const {
    OsdsLink: ActualOsdsLink,
    OsdsMessage: ActualOsdsMessage,
    ...rest
  } = await vi.importActual('@ovhcloud/ods-components/react');

  const [OsdsLinkElem, OsdsMessageElem] = [
    ActualOsdsLink as React.ElementType,
    ActualOsdsMessage as React.ElementType,
  ];

  return {
    ...rest,
    OsdsLink: vi
      .fn()
      .mockImplementation(({ children, ...props }) => (
        <OsdsLinkElem {...props}>{children}</OsdsLinkElem>
      )),
    OsdsMessage: vi
      .fn()
      .mockImplementation(({ children, ...props }) => (
        <OsdsMessageElem {...props}>{children}</OsdsMessageElem>
      )),
  };
});

const renderStep = () => render(<InstanceStep />, { wrapper });
const renderStore = () => renderHook(() => useCreateStore());

describe('InstanceStep', () => {
  beforeEach(() => {
    const { result } = renderStore();
    act(() => {
      result.current.reset();
      result.current.open(StepsEnum.INSTANCE);
    });
  });
  describe('should render', () => {
    it('should render StepComponent with right props', () => {
      renderStep();

      const { calls } = (StepComponent as Mock).mock;
      const call = calls[calls.length - 1][0] as TStepProps;

      expect(call.title).toBe(
        'load-balancer/create | octavia_load_balancer_create_instance_title',
      );

      expect(call.isOpen).toBe(true);

      expect(call.isChecked).toBe(false);

      expect(call.isLocked).toBe(false);

      expect(call.order).toBe(5);

      expect(call.next.label).toBe(
        'pci-common | common_stepper_next_button_label',
      );
      expect(call.next.isDisabled).not.toBeDefined();

      expect(call.edit.label).toBe(
        'pci-common | common_stepper_modify_this_step',
      );

      expect(call.skip.label).toBe(
        'pci-common | common_stepper_skip_this_step',
      );

      expect(call.skip.hint).toBe('pci-common | common_stepper_optional_label');
    });

    describe.skip('Get started link', () => {
      it('should render ovhSubsidiary product link if found', () => {
        ((OsdsLink as unknown) as Mock).mockImplementationOnce(({ href }) => (
          <a href={href} data-testid="link"></a>
        ));
        (useMe as Mock).mockImplementation(() => ({
          me: { ovhSubsidiary: 'FR' },
        }));
        // (Translation as Mock).mockImplementationOnce(({ children }: { children: (fr) => React.ReactElement }) => (
        //   <>{children(tr)}</>
        // ));
        // (Trans as Mock).mockImplementationOnce(({ tr,i18nKey,values }) => console.log("wa7id"));
        const { getByTestId } = renderStep();

        // expect(getByTestId('link').attributes.getNamedItem('href').value).toBe(
        //   GETTING_STARTED_LINK.FR,
        // );
      });

      it.skip('should render default product link if not found', () => {
        ((OsdsLink as unknown) as Mock).mockImplementationOnce(({ href }) => (
          <a href={href} data-testid="link"></a>
        ));
        (useMe as Mock).mockImplementation(() => ({
          me: undefined,
        }));
        const { getByTestId } = renderStep();

        expect(getByTestId('link').attributes.getNamedItem('href').value).toBe(
          PRODUCT_LINK.DEFAULT,
        );
      });
    });

    it.skip('Should show information message', () => {
      ((OsdsMessage as unknown) as Mock).mockImplementationOnce(
        ({ children, ...props }) => (
          <OsdsMessage data-testid="info-message" {...props}>
            {children}
          </OsdsMessage>
        ),
      );
      const { queryByTestId } = renderStep();

      expect(queryByTestId('info-message')).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    beforeAll(() => {
      (InstanceTable as Mock).mockImplementationOnce(() => (
        <div data-testid="input"></div>
      ));
    });

    describe('next', () => {
      describe('render', () => {
        test('Should render', () => {
          const { getByText } = renderStep();

          expect(
            getByText('pci-common | common_stepper_next_button_label'),
          ).toBeInTheDocument();
        });
      });
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

          expect(trackStepSpy).toHaveBeenCalledWith(5);
        });
        test("Prepare name's step on next click", () => {
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

          expect(result.current.check).toHaveBeenCalledWith(StepsEnum.INSTANCE);
          expect(result.current.lock).toHaveBeenCalledWith(StepsEnum.INSTANCE);
          expect(result.current.open).toHaveBeenCalledWith(StepsEnum.NAME);

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
          act(() => result.current.lock(StepsEnum.INSTANCE));

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

          act(() => result.current.lock(StepsEnum.INSTANCE));

          result.current.unlock = vi.fn();
          result.current.uncheck = vi.fn();
          result.current.open = vi.fn();
          result.current.reset = vi.fn();

          const { getByText } = renderStep();

          const editButton = getByText(
            'pci-common | common_stepper_modify_this_step',
          );

          act(() => editButton.click());

          expect(result.current.unlock).toHaveBeenCalledWith(
            StepsEnum.INSTANCE,
          );
          expect(result.current.uncheck).toHaveBeenCalledWith(
            StepsEnum.INSTANCE,
          );
          expect(result.current.open).toHaveBeenCalledWith(StepsEnum.INSTANCE);
          expect(result.current.reset).toHaveBeenCalledWith(StepsEnum.NAME);

          result.current.unlock = unlock;
          result.current.uncheck = uncheck;
          result.current.open = open;
          result.current.reset = reset;
        });
      });
    });

    describe('skip', () => {
      describe('render', () => {
        test('Should render', () => {
          const { getByText } = renderStep();

          expect(
            getByText('pci-common | common_stepper_skip_this_step'),
          ).toBeInTheDocument();
        });
      });
      describe('click', () => {
        it('Should track on skip click', async () => {
          const trackClick = vi.fn();

          (useTracking as Mock).mockReturnValue({ trackClick });

          const { getByText } = renderStep();

          const skipButton = getByText(
            'pci-common | common_stepper_skip_this_step',
          );

          act(() => skipButton.click());

          expect(trackClick).toHaveBeenCalledWith({
            name: LOAD_BALANCER_CREATION_TRACKING.SKIP_STEP_5,
            type: 'action',
          });
        });
        it('should reset listeners', () => {
          const { result } = renderStore();
          const { listeners } = result.current.set;

          result.current.set.listeners = vi.fn();

          const { getByText } = renderStep();
          const skipButton = getByText(
            'pci-common | common_stepper_skip_this_step',
          );

          act(() => skipButton.click());

          expect(result.current.set.listeners).toHaveBeenCalledWith([]);

          result.current.set.listeners = listeners;
        });
        test("Prepare name's step on skip click", () => {
          const { result } = renderStore();

          const { getByText } = renderStep();

          const skipButton = getByText(
            'pci-common | common_stepper_skip_this_step',
          );

          const { check, lock, open } = { ...result.current };

          result.current.check = vi.fn();
          result.current.lock = vi.fn();
          result.current.open = vi.fn();

          act(() => skipButton.click());

          expect(result.current.check).toHaveBeenCalledWith(StepsEnum.INSTANCE);
          expect(result.current.lock).toHaveBeenCalledWith(StepsEnum.INSTANCE);
          expect(result.current.open).toHaveBeenCalledWith(StepsEnum.NAME);

          result.current.check = check;
          result.current.lock = lock;
          result.current.open = open;
        });
      });
    });
  });
});
