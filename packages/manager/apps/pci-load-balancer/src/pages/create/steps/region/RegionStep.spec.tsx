import { describe, Mock, vi } from 'vitest';
import {
  StepComponent,
  TStepProps,
  useMe,
} from '@ovh-ux/manager-react-components';
import { render, renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { OsdsLink, OsdsSpinner } from '@ovhcloud/ods-components/react';
import {
  ShapesInputComponent,
  TShapesInputProps,
} from '@ovh-ux/manager-pci-common';
import { wrapper } from '@/wrapperRenders';
import { RegionStep } from './RegionStep';
import { StepsEnum, TAddon, useCreateStore } from '@/pages/create/store';
import { REGION_AVAILABILITY_LINK } from '@/constants';
import { TRegion, useGetRegions } from '@/api/hook/useRegions';
import { useTracking } from '../../hooks/useTracking';
import { LabelComponent } from '@/pages/create/steps/region/components/Label.component';
import { StackLabelComponent } from '@/pages/create/steps/region/components/StackLabel.component';
import { StackTitleComponent } from '@/pages/create/steps/region/components/StackTitle.component';
import { GroupLabelComponent } from '@/pages/create/steps/region/components/GroupLabel.component';

vi.mock('react-i18next', async () => {
  const { ...rest } = await vi.importActual('react-i18next');
  return {
    ...rest,
    useTranslation: vi.fn().mockImplementation((namespace: string) => ({
      t: vi.fn().mockImplementation((key: string) => `${namespace} | ${key}`),
    })),
  };
});

vi.mock('react-use', async () => ({
  useMedia: vi.fn().mockReturnValue(true),
}));

vi.mock('../../hooks/useTracking', async () => ({
  useTracking: vi.fn().mockImplementation(() => ({ trackStep: vi.fn() })),
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
      .mockImplementation(({ children, ...props }) => (
        <OsdsSpinnerElem {...props}>{children}</OsdsSpinnerElem>
      )),
    OsdsLink: vi
      .fn()
      .mockImplementation(({ children, ...props }) => (
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
vi.mock('@ovh-ux/manager-pci-common', async () => {
  const {
    ShapesInputComponent: ActualShapesInputComponent,
    ...rest
  } = await vi.importActual('@ovh-ux/manager-pci-common');
  return {
    ...rest,
    ShapesInputComponent: vi
      .fn()
      .mockImplementation(
        ActualShapesInputComponent as typeof ShapesInputComponent,
      ),
  };
});

vi.mock('@/api/hook/useRegions', async () => {
  const { ...rest } = await vi.importActual('@/api/hook/useRegions');
  return {
    ...rest,
    useGetRegions: vi
      .fn()
      .mockImplementation(() => ({ data: undefined, isPending: true })),
  };
});

const renderStep = () => render(<RegionStep />, { wrapper });
const renderStore = () => renderHook(() => useCreateStore());

describe('RegionStep', () => {
  beforeEach(() => {
    const { result } = renderStore();
    act(() => {
      result.current.reset();
      result.current.open(StepsEnum.REGION);
    });
  });
  describe('should render', () => {
    beforeAll(() => {
      (useMe as Mock).mockImplementation(() => ({ me: undefined }));

      renderStep();
    });
    it('should render StepComponent with right props', () => {
      (StepComponent as Mock).mockImplementationOnce(({ children }) => (
        <div>{children}</div>
      ));

      const { calls } = (StepComponent as Mock).mock;
      const call = calls[calls.length - 1][0] as TStepProps;

      expect(call.title).toBe(
        'load-balancer/create | octavia_load_balancer_create_region_title',
      );

      expect(call.isOpen).toBe(true);

      expect(call.isChecked).toBe(false);

      expect(call.isLocked).toBe(false);

      expect(call.order).toBe(2);

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
          'load-balancer/create | octavia_load_balancer_create_region_intro',
        ),
      ).toBeInTheDocument();
      expect(
        getByText(
          'load-balancer/create | octavia_load_balancer_create_region_link',
        ),
      ).toBeInTheDocument();
    });

    describe('Region availability link', () => {
      it("should render ovhSubsidiary region's availability link if found", () => {
        ((OsdsLink as unknown) as Mock).mockImplementationOnce(({ href }) => (
          <a href={href} data-testid="link"></a>
        ));
        (useMe as Mock).mockImplementation(() => ({
          me: { ovhSubsidiary: 'FR' },
        }));
        const { getByTestId } = renderStep();

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
        const { getByTestId } = renderStep();

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

        const { getByTestId } = renderStep();

        expect(getByTestId('spinner')).toBeInTheDocument();
      });

      describe('regions are not pending', () => {
        beforeAll(() => {
          ((ShapesInputComponent as unknown) as Mock).mockImplementationOnce(
            () => <div data-testid="input"></div>,
          );
        });
        it('should show input if regions are not pending and data is null', () => {
          (useGetRegions as Mock).mockImplementation(() => ({
            data: undefined,
            isPending: false,
          }));

          renderStep();

          const { calls } = (ShapesInputComponent as Mock).mock;
          const call = calls[calls.length - 1][0] as TShapesInputProps<TRegion>;

          expect(call.items).toEqual([]);
        });
        it('should show input if regions are not pending and data is defined', () => {
          const regions = [
            { name: 'test', isEnabled: true, continent: 'Europe' },
            { name: 'test2', isEnabled: true, continent: 'Asia' },
          ];
          (useGetRegions as Mock).mockImplementation(() => ({
            data: new Map([['s', regions]]),
            isPending: false,
          }));

          const { result } = renderStore();

          act(() => result.current.set.addon({ code: 's' } as TAddon));

          renderStep();

          const { calls } = (ShapesInputComponent as Mock).mock;
          const call = calls[calls.length - 1][0] as TShapesInputProps<TRegion>;

          expect(call.items).toEqual(regions);
          expect(call.value).toBe(null);

          expect(call.item.LabelComponent).toEqual(LabelComponent);
          expect(call.item.getId({ name: 'test' } as TRegion)).toBe('test');
          expect(call.item.isDisabled({ isEnabled: true } as TRegion)).toBe(
            false,
          );

          expect(call.stack.by({ macroName: 'test' } as TRegion)).toBe('test');
          expect(call.stack.by({} as TRegion)).toBe('');
          expect(call.stack.LabelComponent).toEqual(StackLabelComponent);
          expect(call.stack.TitleComponent).toEqual(StackTitleComponent);

          expect(call.group.by({ continent: 'Europe' } as TRegion)).toBe(
            'Europe',
          );
          expect(call.group.LabelComponent).toEqual(GroupLabelComponent);
        });
      });
    });
  });

  describe('Actions', () => {
    beforeAll(() => {
      (useGetRegions as Mock).mockImplementationOnce(() => ({
        isPending: false,
      }));
      (ShapesInputComponent as Mock).mockImplementationOnce(() => (
        <div data-testid="input"></div>
      ));
    });

    describe('next', () => {
      describe('render', () => {
        test('Next button should be disabled if region is not set', () => {
          const { getByText } = renderStep();

          const nextButton = getByText(
            'pci-common | common_stepper_next_button_label',
          );
          expect(
            nextButton.attributes.getNamedItem('disabled').value,
          ).toBeTruthy();
        });

        test('Next button should be enabled if region is set', () => {
          (ShapesInputComponent as Mock).mockImplementationOnce(() => (
            <div data-testid="input"></div>
          ));

          const { result } = renderStore();
          act(() => result.current.set.region({} as TRegion));

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
          (ShapesInputComponent as Mock).mockImplementationOnce(() => (
            <div data-testid="input"></div>
          ));
          const trackStepSpy = vi.fn();

          (useTracking as Mock).mockImplementationOnce(() => ({
            trackStep: trackStepSpy,
          }));

          const { result } = renderStore();

          act(() => {
            result.current.set.region({} as TRegion);
          });

          const { getByText } = renderStep();

          const nextButton = getByText(
            'pci-common | common_stepper_next_button_label',
          );

          act(() => nextButton.click());

          expect(trackStepSpy).toHaveBeenCalledWith(2);
        });

        it('Should prepare next step on next click', async () => {
          (ShapesInputComponent as Mock).mockImplementationOnce(() => (
            <div data-testid="input"></div>
          ));

          const { result } = renderStore();

          act(() => {
            result.current.set.region({} as TRegion);
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

          expect(result.current.check).toHaveBeenCalledWith(StepsEnum.REGION);
          expect(result.current.lock).toHaveBeenCalledWith(StepsEnum.REGION);
          expect(result.current.open).toHaveBeenCalledWith(StepsEnum.IP);

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
          act(() => result.current.lock(StepsEnum.REGION));

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

          act(() => result.current.lock(StepsEnum.REGION));

          result.current.unlock = vi.fn();
          result.current.uncheck = vi.fn();
          result.current.open = vi.fn();
          result.current.reset = vi.fn();

          const { getByText } = renderStep();

          const editButton = getByText(
            'pci-common | common_stepper_modify_this_step',
          );

          act(() => editButton.click());

          expect(result.current.unlock).toHaveBeenCalledWith(StepsEnum.REGION);
          expect(result.current.uncheck).toHaveBeenCalledWith(StepsEnum.REGION);
          expect(result.current.open).toHaveBeenCalledWith(StepsEnum.REGION);
          expect(result.current.reset).toHaveBeenCalledWith(
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
