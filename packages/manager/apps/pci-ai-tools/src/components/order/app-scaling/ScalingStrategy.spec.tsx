import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { describe, expect, it, vi } from 'vitest';
import {
  useForm,
  FormProvider,
  Resolver,
  UseFormReturn,
} from 'react-hook-form';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import ScalingStrategy from './ScalingStrategy.component';
import ai from '@/types/AI';
import {
  baseScalingSchema,
  ScalingStrategySchema,
  useScalingStrategyForm,
} from './scalingHelper';

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

  const TestWrapper = ({
    autoScaling = false,
    replicas = 1,
    onSubmit = vi.fn(),
  }: {
    autoScaling?: boolean;
    replicas?: number;
    onSubmit?: (data: ScalingStrategySchema) => void;
  }) => {
    const tScaling = (key: string) => key;
    const form = useForm<ScalingStrategySchema>({
      resolver: zodResolver(
        baseScalingSchema(tScaling),
      ) as Resolver<ScalingStrategySchema>,
      mode: 'onChange',
      defaultValues: {
        autoScaling,
        replicas,
        replicasMin: 1,
        replicasMax: 1,
        cooldownPeriodSeconds: 300,
        scaleUpStabilizationWindowSeconds: 0,
        scaleDownStabilizationWindowSeconds: 300,
        resourceType: ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU,
        averageUsageTarget: 75,
        metricUrl: '',
        dataFormat: ai.app.CustomMetricsFormatEnum.JSON,
        dataLocation: '',
        targetMetricValue: 0,
        aggregationType: ai.app.CustomMetricsAggregationTypeEnum.AVERAGE,
      },
    });

    return (
      <FormProvider {...form}>
        <form>
          <ScalingStrategyHarness form={form} />
          <button
            type="button"
            onClick={() => {
              void form.handleSubmit(onSubmit)();
            }}
          >
            submit
          </button>
        </form>
      </FormProvider>
    );
  };

  const ScalingStrategyHarness = ({
    form,
  }: {
    form: UseFormReturn<ScalingStrategySchema>;
  }) => {
    const {
      autoScaling,
      averageUsageTargetValue,
      isCustom,
      syncReplicasMaxFromMin,
      showScaleToZero,
    } = useScalingStrategyForm(form);

    return (
      <ScalingStrategy
        autoScaling={autoScaling}
        averageUsageTarget={averageUsageTargetValue}
        control={form.control}
        isCustom={isCustom}
        syncReplicasMaxFromMin={syncReplicasMaxFromMin}
        showScaleToZero={showScaleToZero}
      />
    );
  };

  it('should display Autoscaling form with value', async () => {
    render(<TestWrapper autoScaling={true} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('scaling-strat-container')).toBeTruthy();
      expect(screen.getByTestId('auto-scaling-container')).toBeTruthy();
    });
  });

  it('should display Fixed scaling on switch click', async () => {
    render(<TestWrapper autoScaling={true} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('scaling-strat-container')).toBeTruthy();
      expect(screen.getByTestId('auto-scaling-container')).toBeTruthy();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('switch-scaling-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('fixed-scaling-container')).toBeTruthy();
    });
  });

  it('should display fixed scaling form', async () => {
    render(<TestWrapper autoScaling={false} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('fixed-scaling-container')).toBeTruthy();
      expect(screen.getByTestId('replicas-input')).toBeTruthy();
    });
  });

  it('should normalize max replicas when minimum replicas becomes greater', async () => {
    const onSubmit = vi.fn();

    render(<TestWrapper autoScaling={true} onSubmit={onSubmit} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    const minInput = await screen.findByTestId(
      'min-rep-input',
    ) as HTMLInputElement;
    const maxInput = screen.getByTestId('max-rep-input') as HTMLInputElement;

    act(() => {
      fireEvent.change(maxInput, { target: { value: '1' } });
      fireEvent.change(minInput, { target: { value: '2' } });
    });

    await waitFor(() => {
      expect(maxInput.value).toBe('2');
    });

    fireEvent.click(screen.getByRole('button', { name: 'submit' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });

    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      replicasMin: 2,
      replicasMax: 2,
    });
  });
});
