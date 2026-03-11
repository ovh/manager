import { useTranslation } from 'react-i18next';
import { FormProvider, Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
  ScrollBar,
  ScrollArea,
} from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import { useAppData } from '../../../App.context';
import RouteModal from '@/components/route-modal/RouteModal';
import ScalingStrategy from '@/components/order/app-scaling/ScalingStrategy.component';
import { Scaling } from '@/types/orderFunnel';
import { useScalingStrategy } from '@/data/hooks/ai/app/scaling-strategy/useScalingStrategy.hook';
import {
  getInitialValues,
  FullScalingFormValues,
  baseScalingSchema,
  ResourceType,
  useScalingStrategyForm,
  withScalingResolverSync,
} from '@/components/order/app-scaling/scalingHelper';

const UpdateScaling = () => {
  const { app, projectId } = useAppData();
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation('ai-tools/apps/app/dashboard/update-scaling');
  const { t: tScaling } = useTranslation('ai-tools/components/scaling');

  const automatic = app.spec.scalingStrategy?.automatic;
  const fixed = app.spec.scalingStrategy?.fixed;
  const currentScaling: Scaling = {
    autoScaling: !!automatic,
    replicas: fixed?.replicas || automatic?.replicasMin || 1,
    replicasMin: automatic?.replicasMin,
    replicasMax: automatic?.replicasMax,
    cooldownPeriodSeconds: automatic?.cooldownPeriodSeconds,
    scaleUpStabilizationWindowSeconds:
      automatic?.scaleUpStabilizationWindowSeconds,
    scaleDownStabilizationWindowSeconds:
      automatic?.scaleDownStabilizationWindowSeconds,
    resourceType: automatic?.customMetrics
      ? ResourceType.CUSTOM
      : automatic?.resourceType,
    averageUsageTarget: automatic?.averageUsageTarget,
    metricUrl: automatic?.customMetrics?.apiUrl,
    dataFormat: automatic?.customMetrics?.format,
    dataLocation: automatic?.customMetrics?.valueLocation,
    targetMetricValue: automatic?.customMetrics?.targetValue,
    aggregationType: automatic?.customMetrics?.aggregationType,
  };

  const scalingSchema = baseScalingSchema(tScaling);

  const form = useForm<FullScalingFormValues>({
    resolver: withScalingResolverSync(
      zodResolver(
        scalingSchema,
      ) as Resolver<FullScalingFormValues>,
    ),
    defaultValues: getInitialValues(currentScaling),
    mode: 'onChange',
  });
  const {
    autoScaling,
    averageUsageTargetValue,
    isCustom,
    syncReplicasMaxFromMin,
    showScaleToZero,
  } = useScalingStrategyForm(form);

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
    const isCustom = formValues.resourceType === ResourceType.CUSTOM;

    let scalingInfo: ai.app.ScalingStrategyInput;

    if (formValues.autoScaling) {
      const automaticScaling: ai.app.ScalingStrategyInput['automatic'] = {
        replicasMin: formValues.replicasMin,
        replicasMax: formValues.replicasMax,
        scaleUpStabilizationWindowSeconds:
          formValues.scaleUpStabilizationWindowSeconds,
        scaleDownStabilizationWindowSeconds:
          formValues.scaleDownStabilizationWindowSeconds,
        ...(formValues.replicasMin === 0 && {
          cooldownPeriodSeconds: formValues.cooldownPeriodSeconds,
        }),
        ...((!isCustom && {
          averageUsageTarget: formValues.averageUsageTarget,
          resourceType:
            formValues.resourceType as ai.app.ScalingAutomaticStrategyResourceTypeEnum,
        }) ||
          {}),
        ...(isCustom && {
          customMetrics: {
            apiUrl: formValues.metricUrl || '',
            format: formValues.dataFormat as ai.app.CustomMetricsFormatEnum,
            targetValue: formValues.targetMetricValue || 0,
            valueLocation: formValues.dataLocation || '',
            aggregationType:
              formValues.aggregationType as ai.app.CustomMetricsAggregationTypeEnum,
          },
        }),
      };

      scalingInfo = { automatic: automaticScaling };
    } else {
      scalingInfo = { fixed: { replicas: formValues.replicas } };
    }

    scalingStrategy({ projectId, appId: app.id, scalingStrat: scalingInfo });
  });

  return (
    <RouteModal
      backUrl="../"
      isLoading={false}
    >
      <DialogContent className="min-w-[50vw]">
        <DialogHeader>
          <DialogTitle data-testid="update-scaling-modal">
            {t('updateScalingTitle')}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <FormProvider {...form}>
            <form onSubmit={onSubmit} className="flex flex-col gap-2 pr-4">
              <ScalingStrategy
                autoScaling={autoScaling}
                averageUsageTarget={averageUsageTargetValue}
                control={form.control}
                isCustom={isCustom}
                syncReplicasMaxFromMin={syncReplicasMaxFromMin}
                showScaleToZero={showScaleToZero}
              />
              <DialogFooter className="flex justify-end">
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
                  disabled={isPending}
                >
                  {t('updateScalingButtonConfirm')}
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </DialogContent>
    </RouteModal>
  );
};

export default UpdateScaling;
