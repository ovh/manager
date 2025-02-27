import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import { AppPricing, Scaling } from '@/types/orderFunnel';
import * as ai from '@/types/cloud/project/ai';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import ScalingStrategy from './ScalingStrategy.component';

describe('Scaling strategy component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockManagerReactShellClient();
    vi.mock('@/hooks/api/catalog/useGetCatalog.hook', () => {
      return {
        useGetCatalog: vi.fn(() => ({
          isSuccess: true,
          data: {
            locale: {
              currencyCode: 'EUR',
            },
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
      <ScalingStrategy
        onChange={onChange}
        scaling={basedScaling}
        pricingFlavor={resourcePrice}
        onNonValidForm={onNonValidForm}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.getByTestId('scaling-strat-container')).toBeInTheDocument();
      expect(screen.getByTestId('auto-scaling-container')).toBeInTheDocument();
    });
  });

  it('should display Fixed scaling on switch click', async () => {
    render(
      <ScalingStrategy
        onChange={onChange}
        scaling={basedScaling}
        pricingFlavor={resourcePrice}
        onNonValidForm={onNonValidForm}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.getByTestId('scaling-strat-container')).toBeInTheDocument();
      expect(screen.getByTestId('auto-scaling-container')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('switch-scaling-button'));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({
        ...basedScaling,
        autoScaling: false,
      });
    });
  });

  it('should trigger onChange on fixed input', async () => {
    const fixedScaling: Scaling = {
      ...basedScaling,
      autoScaling: false,
    };
    render(
      <ScalingStrategy
        onChange={onChange}
        scaling={fixedScaling}
        pricingFlavor={resourcePrice}
        onNonValidForm={onNonValidForm}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.getByTestId('fixed-scaling-container')).toBeInTheDocument();
      expect(screen.getByTestId('replicas-input')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.change(screen.getByTestId('replicas-input'), {
        target: {
          value: 4,
        },
      });
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({ ...fixedScaling, replicas: 4 });
    });
  });
});
