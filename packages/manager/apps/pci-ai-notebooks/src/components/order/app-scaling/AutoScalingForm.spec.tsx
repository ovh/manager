import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { AutoScalingForm } from './AutoScalingForm.component';
import { AppPricing, Scaling } from '@/types/orderFunnel';
import * as ai from '@/types/cloud/project/ai';

describe('Autoscaling form component', () => {
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
