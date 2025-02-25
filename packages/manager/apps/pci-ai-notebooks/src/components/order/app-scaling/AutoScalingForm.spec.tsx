import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { mockedUser } from '@/__tests__/helpers/mocks/user';
import { Locale } from '@/hooks/useLocale';
import { AutoScalingForm } from './AutoScalingForm.component';
import { AppPricing, Scaling } from '@/types/orderFunnel';
import * as ai from '@/types/cloud/project/ai';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';

describe('Autoscaling form component', () => {
  beforeEach(async () => {
    const ResizeObserverMock = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);

    vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
      const mod = await importOriginal<
        typeof import('@ovh-ux/manager-react-shell-client')
      >();
      return {
        ...mod,
        useShell: vi.fn(() => ({
          i18n: {
            getLocale: vi.fn(() => Locale.fr_FR),
            onLocaleChange: vi.fn(),
            setLocale: vi.fn(),
          },
          environment: {
            getEnvironment: vi.fn(() => ({
              getUser: vi.fn(() => mockedUser),
            })),
          },
        })),
      };
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  const basedScaling: Scaling = {
    autoScaling: true,
    replicas: 1,
    replicasMin: 1,
    replicasMax: 2,
    averageUsageTarget: 75,
    resourceType: ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU,
  };
  const resourcePrice: AppPricing = {
    price: 8,
    tax: 4,
  };

  const onChange = vi.fn();
  const onNonValidForm = vi.fn();
  it('should display Autoscaling form with value', async () => {
    render(
      <AutoScalingForm
        onChange={onChange}
        scaling={basedScaling}
        pricingFlavor={resourcePrice}
        onNonValidForm={onNonValidForm}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.getByTestId('auto-scaling-container')).toBeInTheDocument();
      expect(screen.getByTestId('resource-usage-slider')).toBeInTheDocument();
      expect(screen.getByTestId('max-rep-input')).toBeInTheDocument();
      expect(screen.getByTestId('min-rep-input')).toBeInTheDocument();
    });
  });

  it('should trigger onNonValidForm when input is not correct', async () => {
    render(
      <AutoScalingForm
        onChange={onChange}
        scaling={basedScaling}
        pricingFlavor={resourcePrice}
        onNonValidForm={onNonValidForm}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.getByTestId('auto-scaling-container')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.change(screen.getByTestId('max-rep-input'), {
        target: {
          value: 2,
        },
      });
      fireEvent.change(screen.getByTestId('min-rep-input'), {
        target: {
          value: 5,
        },
      });
    });

    await waitFor(() => {
      expect(onChange).not.toHaveBeenCalled();
      expect(onNonValidForm).toHaveBeenCalledWith(true);
    });
  });

  it('should trigger onChange', async () => {
    render(
      <AutoScalingForm
        onChange={onChange}
        scaling={basedScaling}
        pricingFlavor={resourcePrice}
        onNonValidForm={onNonValidForm}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.getByTestId('auto-scaling-container')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.change(screen.getByTestId('max-rep-input'), {
        target: {
          value: 5,
        },
      });
      fireEvent.change(screen.getByTestId('min-rep-input'), {
        target: {
          value: 2,
        },
      });
      fireEvent.change(screen.getByTestId('min-rep-input'), {
        target: {
          value: 2,
        },
      });
      fireEvent.click(screen.getByTestId('radio-ram'));
    });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledTimes(3);
    });
  });
});
