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
      resourceType: z.nativeEnum(
        ai.app.ScalingAutomaticStrategyResourceTypeEnum,
      ),
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
      resourceType:
        app.spec.scalingStrategy?.automatic?.resourceType ||
        ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU,
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
    const scalingInfo: ai.app.ScalingStrategyInput = formValues.scaling
      .autoScaling
      ? {
          automatic: {
            averageUsageTarget: formValues.scaling.averageUsageTarget,
            replicasMax: formValues.scaling.replicasMax,
            replicasMin: formValues.scaling.replicasMin,
            resourceType: formValues.scaling.resourceType,
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="update-scaling-modal">
            {t('updateScalingTitle')}
          </DialogTitle>
        </DialogHeader>
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
                disabled={isPending || invalidForm}
              >
                {t('updateScalingButtonConfirm')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </RouteModal>
  );
};

export default UpdateScaling;
