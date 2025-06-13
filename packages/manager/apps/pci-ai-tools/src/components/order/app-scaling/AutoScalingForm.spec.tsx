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
import {
  mockedAppPricing1,
  mockedOrderScaling,
} from '@/__tests__/helpers/mocks/app/appHelper';

describe('Autoscaling form component', () => {
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
      <AutoScalingForm
        onChange={onChange}
        scaling={mockedOrderScaling}
        pricingFlavor={mockedAppPricing1}
        onNonValidForm={onNonValidForm}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.getByTestId('auto-scaling-container')).toBeTruthy();
      expect(screen.getByTestId('resource-usage-slider')).toBeTruthy();
      expect(screen.getByTestId('max-rep-input')).toBeTruthy();
      expect(screen.getByTestId('min-rep-input')).toBeTruthy();
    });
  });

  it('should trigger onNonValidForm when input is not correct', async () => {
    render(
      <AutoScalingForm
        onChange={onChange}
        scaling={mockedOrderScaling}
        pricingFlavor={mockedAppPricing1}
        onNonValidForm={onNonValidForm}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.getByTestId('auto-scaling-container')).toBeTruthy();
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
        scaling={mockedOrderScaling}
        pricingFlavor={mockedAppPricing1}
        onNonValidForm={onNonValidForm}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.getByTestId('auto-scaling-container')).toBeTruthy();
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
          value: 4,
        },
      });
      fireEvent.click(screen.getByTestId('radio-ram'));
    });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledTimes(3);
    });
  });
});
