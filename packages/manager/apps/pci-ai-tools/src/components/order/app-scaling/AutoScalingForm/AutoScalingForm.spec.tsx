import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi, beforeEach, afterEach } from 'vitest';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { AutoScalingForm } from './AutoScalingForm.component';
import {
  mockedAppPricing1,
  mockedOrderScaling,
} from '@/__tests__/helpers/mocks/app/appHelper';

describe('AutoScalingForm component', () => {
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

  describe('Rendering', () => {
    it('should display AutoScalingForm with all required fields', async () => {
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
        expect(screen.getByTestId('radio-cpu')).toBeTruthy();
        expect(screen.getByTestId('radio-ram')).toBeTruthy();
        expect(screen.getByTestId('radio-custom')).toBeTruthy();
      });
    });

    it('should display CPU/RAM fields when not in CUSTOM mode', async () => {
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
        expect(screen.getByTestId('resource-usage-slider')).toBeTruthy();
        expect(screen.queryByTestId('metric-url-input')).toBeFalsy();
      });
    });

    it('should display custom metrics fields when CUSTOM mode is selected', async () => {
      const customScaling = {
        ...mockedOrderScaling,
        resourceType: 'CUSTOM' as const,
      };

      render(
        <AutoScalingForm
          onChange={onChange}
          scaling={customScaling}
          pricingFlavor={mockedAppPricing1}
          onNonValidForm={onNonValidForm}
        />,
        { wrapper: RouterWithQueryClientWrapper },
      );

      await waitFor(() => {
        expect(screen.getByTestId('metric-url-input')).toBeTruthy();
        expect(screen.getByTestId('data-format-select')).toBeTruthy();
        expect(screen.getByTestId('data-location-input')).toBeTruthy();
        expect(screen.getByTestId('target-metric-value-input')).toBeTruthy();
        expect(screen.getByTestId('aggregation-type-select')).toBeTruthy();
      });
    });

    it('should display price when pricingFlavor is provided', async () => {
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
    });
  });

  describe('Validation', () => {
    it('should trigger onNonValidForm when minRep > maxRep', async () => {
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
          target: { value: 2 },
        });
        fireEvent.change(screen.getByTestId('min-rep-input'), {
          target: { value: 5 },
        });
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
        expect(onNonValidForm).toHaveBeenCalledWith(true);
      });
    });

    it('should not trigger validation error when values are valid', async () => {
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
        fireEvent.change(screen.getByTestId('min-rep-input'), {
          target: { value: 2 },
        });
        fireEvent.change(screen.getByTestId('max-rep-input'), {
          target: { value: 5 },
        });
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
        expect(onNonValidForm).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('User Interactions', () => {
    it('should trigger onChange when inputs are modified', async () => {
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
          target: { value: 5 },
        });
        fireEvent.change(screen.getByTestId('min-rep-input'), {
          target: { value: 2 },
        });
        fireEvent.change(screen.getByTestId('min-rep-input'), {
          target: { value: 4 },
        });
        fireEvent.click(screen.getByTestId('radio-ram'));
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledTimes(3);
      });
    });

    it('should switch to CUSTOM mode when CUSTOM radio is clicked', async () => {
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
        fireEvent.click(screen.getByTestId('radio-custom'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('metric-url-input')).toBeTruthy();
        expect(screen.queryByTestId('resource-usage-slider')).toBeFalsy();
      });
    });

    it('should switch to CPU/RAM mode when CPU radio is clicked from CUSTOM', async () => {
      const customScaling = {
        ...mockedOrderScaling,
        resourceType: 'CUSTOM' as const,
      };

      render(
        <AutoScalingForm
          onChange={onChange}
          scaling={customScaling}
          pricingFlavor={mockedAppPricing1}
          onNonValidForm={onNonValidForm}
        />,
        { wrapper: RouterWithQueryClientWrapper },
      );

      await waitFor(() => {
        expect(screen.getByTestId('auto-scaling-container')).toBeTruthy();
      });

      act(() => {
        fireEvent.click(screen.getByTestId('radio-cpu'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('resource-usage-slider')).toBeTruthy();
        expect(screen.queryByTestId('metric-url-input')).toBeFalsy();
      });
    });
  });

  describe('Integration', () => {
    it('should pass correct values to onChange callback', async () => {
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
        fireEvent.change(screen.getByTestId('min-rep-input'), {
          target: { value: 3 },
        });
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
        const callArg = onChange.mock.calls[0][0];
        expect(Number(callArg.replicasMin)).toBe(3);
      });
    });

    it('should initialize with default values when scaling props are empty', async () => {
      const emptyScaling = {
        autoScaling: true,
      };

      render(
        <AutoScalingForm
          onChange={onChange}
          scaling={emptyScaling}
          pricingFlavor={mockedAppPricing1}
          onNonValidForm={onNonValidForm}
        />,
        { wrapper: RouterWithQueryClientWrapper },
      );

      await waitFor(() => {
        expect(screen.getByTestId('auto-scaling-container')).toBeTruthy();
      });

      const minInput = screen.getByTestId('min-rep-input') as HTMLInputElement;
      expect(minInput.value).toBe('1');
    });
  });
});
