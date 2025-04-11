import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import { Scaling } from '@/types/orderFunnel';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import ScalingStrategy from './ScalingStrategy.component';
import {
  mockedAppPricing1,
  mockedOrderScaling,
} from '@/__tests__/helpers/mocks/app/appHelper';

describe('Scaling strategy component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockManagerReactShellClient();
    vi.mock('@/data/hooks/catalog/useGetCatalog.hook', () => {
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

  const onChange = vi.fn();
  const onNonValidForm = vi.fn();
  it('should display Autoscaling form with value', async () => {
    render(
      <ScalingStrategy
        onChange={onChange}
        scaling={mockedOrderScaling}
        pricingFlavor={mockedAppPricing1}
        onNonValidForm={onNonValidForm}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.getByTestId('scaling-strat-container')).toBeTruthy();
      expect(screen.getByTestId('auto-scaling-container')).toBeTruthy();
    });
  });

  it('should display Fixed scaling on switch click', async () => {
    render(
      <ScalingStrategy
        onChange={onChange}
        scaling={mockedOrderScaling}
        pricingFlavor={mockedAppPricing1}
        onNonValidForm={onNonValidForm}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.getByTestId('scaling-strat-container')).toBeTruthy();
      expect(screen.getByTestId('auto-scaling-container')).toBeTruthy();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('switch-scaling-button'));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({
        ...mockedOrderScaling,
        autoScaling: false,
      });
    });
  });

  it('should trigger onChange on fixed input', async () => {
    const fixedScaling: Scaling = {
      ...mockedOrderScaling,
      autoScaling: false,
    };
    render(
      <ScalingStrategy
        onChange={onChange}
        scaling={fixedScaling}
        pricingFlavor={mockedAppPricing1}
        onNonValidForm={onNonValidForm}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.getByTestId('fixed-scaling-container')).toBeTruthy();
      expect(screen.getByTestId('replicas-input')).toBeTruthy();
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
