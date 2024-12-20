import { describe, Mock, vi } from 'vitest';
import { StepComponent, TStepProps } from '@ovh-ux/manager-react-components';
import { render, renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { OsdsLink, OsdsSpinner } from '@ovhcloud/ods-components/react';
import { wrapper } from '@/wrapperRenders';
import { RegionStep, TRegionStepProps } from './RegionStep';
import { StepsEnum, useCreateStore } from '@/pages/create/store';
import { REGION_AVAILABILITY_LINK } from '@/constants';

vi.mock('@ovh-ux/manager-pci-common', () => ({
  useProject: vi.fn().mockReturnValue({ data: { project_id: 'project_id' } }),
  RegionSelector: () => <div />,
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
    StepComponent: vi
      .fn()
      .mockImplementation(ActualStepComponent as typeof StepComponent),
  };
});

const renderStep = (
  {
    isLoading = false,
    regions = undefined,
    ovhSubsidiary = undefined,
  }: Partial<TRegionStepProps> = {
    isLoading: false,
    regions: undefined,
    ovhSubsidiary: undefined,
  },
) =>
  render(
    <RegionStep
      isLoading={isLoading}
      regions={regions}
      ovhSubsidiary={ovhSubsidiary}
    />,
    { wrapper },
  );
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
      beforeEach(() => {
        ((OsdsLink as unknown) as Mock).mockImplementation(
          ({ href, ...props }) => (
            <a href={href} data-testid="link" {...props}></a>
          ),
        );
      });

      it("should render ovhSubsidiary region's availability link if found", () => {
        const { getByTestId } = renderStep({ ovhSubsidiary: 'FR' });

        expect(getByTestId('link').attributes.getNamedItem('href').value).toBe(
          REGION_AVAILABILITY_LINK.FR,
        );
      });

      it("should render default region's availability link if not found", () => {
        const { getByTestId } = renderStep();

        expect(getByTestId('link').attributes.getNamedItem('href').value).toBe(
          REGION_AVAILABILITY_LINK.DEFAULT,
        );
      });
    });

    describe('regions', () => {
      it('should show spinner if isLoading', () => {
        ((OsdsSpinner as unknown) as Mock).mockImplementationOnce(() => (
          <div data-testid="spinner"></div>
        ));

        const { getByTestId } = renderStep({ isLoading: true });

        expect(getByTestId('spinner')).toBeInTheDocument();
      });
    });
  });
});
