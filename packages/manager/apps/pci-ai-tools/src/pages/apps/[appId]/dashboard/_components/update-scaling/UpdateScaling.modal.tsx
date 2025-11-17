import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useToast,
  ScrollBar,
  ScrollArea,
} from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import { useAppData } from '../../../App.context';
import RouteModal from '@/components/route-modal/RouteModal';
import ScalingStrategy from '@/components/order/app-scaling/ScalingStrategy.component';
import { AppPricing } from '@/types/orderFunnel';
import { getFlavorPricing } from '@/lib/priceFlavorHelper';
import { useGetCatalog } from '@/data/hooks/catalog/useGetCatalog.hook';
import { useScalingStrategy } from '@/data/hooks/ai/app/scaling-strategy/useScalingStrategy.hook';

const UpdateScaling = () => {
  const { app, projectId } = useAppData();
  const catalogQuery = useGetCatalog({ refetchOnWindowFocus: false });
  const [invalidForm, setInvalidForm] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation('ai-tools/apps/app/dashboard/update-scaling');

  const pricingResource: AppPricing = useMemo(() => {
    if (!catalogQuery.isSuccess) return { price: 0, tax: 0 };
    return getFlavorPricing(
      app.spec.resources.flavor,
      catalogQuery.data,
      'ai-app',
    );
  }, [app, catalogQuery.isSuccess]);

  const schema = z.object({
    scaling: z.object({
      autoScaling: z.boolean(),
      replicas: z.coerce.number(),
      averageUsageTarget: z.coerce.number(),
      replicasMax: z.coerce.number(),
      replicasMin: z.coerce.number(),
      resourceType: z
        .union([
          z.nativeEnum(ai.app.ScalingAutomaticStrategyResourceTypeEnum),
          z.literal('CUSTOM'),
        ])
        .optional(),
      metricUrl: z.string().optional(),
      dataFormat: z.nativeEnum(ai.app.CustomMetricsFormatEnum).optional(),
      dataLocation: z.string().optional(),
      targetMetricValue: z.number().optional(),
      aggregationType: z
        .nativeEnum(ai.app.CustomMetricsAggregationTypeEnum)
        .optional(),
    }),
  });

  type ValidationSchema = z.infer<typeof schema>;

  const defaultValues: ValidationSchema = {
    scaling: {
      autoScaling: !!app.spec.scalingStrategy?.automatic,
      averageUsageTarget:
        app.spec.scalingStrategy?.automatic?.averageUsageTarget || 75,
      replicas:
        app.spec.scalingStrategy?.fixed?.replicas ||
        app.spec.scalingStrategy?.automatic?.replicasMin,
      replicasMax: app.spec.scalingStrategy?.automatic?.replicasMax || 1,
      replicasMin: app.spec.scalingStrategy?.automatic?.replicasMin || 1,
      resourceType: app.spec.scalingStrategy?.automatic?.customMetrics
        ? 'CUSTOM'
        : app.spec.scalingStrategy?.automatic?.resourceType ||
          ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU,
      metricUrl:
        app.spec.scalingStrategy?.automatic?.customMetrics?.apiUrl || '',
      dataFormat:
        app.spec.scalingStrategy?.automatic?.customMetrics?.format ||
        ai.app.CustomMetricsFormatEnum.JSON,
      dataLocation:
        app.spec.scalingStrategy?.automatic?.customMetrics?.valueLocation || '',
      targetMetricValue:
        app.spec.scalingStrategy?.automatic?.customMetrics?.targetValue || 0,
      aggregationType:
        app.spec.scalingStrategy?.automatic?.customMetrics?.aggregationType ||
        ai.app.CustomMetricsAggregationTypeEnum.AVERAGE,
    },
  };

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { scalingStrategy, isPending } = useScalingStrategy({
    onError: (err) => {
      toast.toast({
        title: t('updateScalingStratToastErrorTitle'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('updateScalingStratToastSuccessTitle'),
        description: t('updateScalingStratToastSuccessDescription'),
      });
      navigate('../');
    },
  });

  const onSubmit = form.handleSubmit((formValues) => {
    const isCustom = formValues.scaling.resourceType === 'CUSTOM';

    const scalingInfo: ai.app.ScalingStrategyInput = formValues.scaling
      .autoScaling
      ? {
          automatic: {
            replicasMin: formValues.scaling.replicasMin,
            replicasMax: formValues.scaling.replicasMax,
            ...((!isCustom && {
              averageUsageTarget: formValues.scaling.averageUsageTarget,
              resourceType: formValues.scaling
                .resourceType as ai.app.ScalingAutomaticStrategyResourceTypeEnum,
            }) ||
              {}),
            ...(isCustom && {
              customMetrics: {
                apiUrl: formValues.scaling.metricUrl,
                format: formValues.scaling
                  .dataFormat as ai.app.CustomMetricsFormatEnum,
                targetValue: formValues.scaling.targetMetricValue,
                valueLocation: formValues.scaling.dataLocation,
                aggregationType: formValues.scaling
                  .aggregationType as ai.app.CustomMetricsAggregationTypeEnum,
              },
            }),
          },
        }
      : { fixed: { replicas: formValues.scaling.replicas } };

    scalingStrategy({ projectId, appId: app.id, scalingStrat: scalingInfo });
  });

  return (
    <RouteModal
      backUrl="../"
      isLoading={!catalogQuery.isSuccess && !(pricingResource.price > 0)}
    >
      <DialogContent className="min-w-[50vw]">
        <DialogHeader>
          <DialogTitle data-testid="update-scaling-modal">
            {t('updateScalingTitle')}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <Form {...form}>
            <form onSubmit={onSubmit} className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="scaling"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ScalingStrategy
                        {...field}
                        scaling={{
                          autoScaling: field.value.autoScaling,
                          averageUsageTarget: field.value.averageUsageTarget,
                          replicas: field.value.replicas,
                          replicasMax: field.value.replicasMax,
                          replicasMin: field.value.replicasMin,
                          resourceType: field.value.resourceType,
                          metricUrl: field.value.metricUrl,
                          dataFormat: field.value.dataFormat,
                          dataLocation: field.value.dataLocation,
                          targetMetricValue: field.value.targetMetricValue,
                          aggregationType: field.value.aggregationType,
                        }}
                        onChange={(newScaling) =>
                          form.setValue('scaling', newScaling)
                        }
                        pricingFlavor={pricingResource}
                        onNonValidForm={(val) => setInvalidForm(val)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex justify-end mr-4">
                <DialogClose asChild>
                  <Button
                    data-testid="update-scaling-cancel-button"
                    type="button"
                    mode="outline"
                  >
                    {t('updateScalingButtonCancel')}
                  </Button>
                </DialogClose>
                <Button
                  data-testid="update-scaling-submit-button"
                  type="submit"
                  disabled={isPending || invalidForm}
                >
                  {t('updateScalingButtonConfirm')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </DialogContent>
    </RouteModal>
  );
};

export default UpdateScaling;
