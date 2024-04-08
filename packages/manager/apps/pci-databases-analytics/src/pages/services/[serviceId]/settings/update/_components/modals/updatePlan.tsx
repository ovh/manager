import { useEffect, useMemo, useRef, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import PlansSelect from '@/components/Order/plan/plan-select';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FullCapabilities } from '@/hooks/api/availabilities.api.hooks';
import { ModalController } from '@/hooks/useModale';
import { createTree } from '@/lib/availabilitiesHelper';
import { order } from '@/models/catalog';
import { database } from '@/models/database';
import { Engine, Version } from '@/models/order-funnel';
import { useServiceData } from '@/pages/services/[serviceId]/layout';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { useUpdateService } from '@/hooks/api/services.api.hooks';
import { computeServicePrice } from '@/lib/pricingHelper';
import Price from '@/components/price';
import PriceUnitSwitch from '@/components/price-unit-switch';
import { Label } from '@/components/ui/label';

interface UpdatePlanProps {
  controller: ModalController;
  suggestions: database.Suggestion[];
  availabilities: database.Availability[];
  capabilities: FullCapabilities;
  catalog: order.publicOrder.Catalog;
  onSuccess?: (service: database.Service) => void;
  onError?: (error: Error) => void;
}

const UpdatePlan = ({
  controller,
  suggestions,
  availabilities,
  capabilities,
  catalog,
  onSuccess,
  onError,
}: UpdatePlanProps) => {
  const [showMonthly, setShowMonthly] = useState(false);
  const { service, projectId } = useServiceData();
  const errorMessageRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/settings/update',
  );
  const { updateService, isPending } = useUpdateService({
    onError: (err) => {
      toast.toast({
        title: t('updatePlanToastErrorTitle'),
        variant: 'destructive',
        description: err.response.data.message,
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: (updatedService) => {
      toast.toast({
        title: t('updatePlanToastSuccessTitle'),
        description: t('updatePlanToastSuccessDescription', {
          newPlan: updatedService.plan,
        }),
      });
      if (onSuccess) {
        onSuccess(updatedService);
      }
    },
  });
  const listEngines = useMemo(
    () =>
      createTree(availabilities, capabilities, suggestions, catalog).map(
        (e) => {
          // order the versions in the engines
          e.versions.sort((a, b) => a.order - b.order);
          return e;
        },
      ),
    [availabilities, capabilities],
  );
  const listPlans = useMemo(
    () =>
      listEngines
        ?.find((e: Engine) => e.name === service.engine)
        ?.versions.find((v: Version) => v.name === service.version)
        ?.plans.sort((a, b) => a.order - b.order) || [],
    [listEngines, service],
  );

  const schema = z.object({
    plan: z
      .string()
      .min(1)
      .refine((newPlan) => newPlan !== service.plan, {
        message: t('updatePlanErrorSimilar'),
      }),
  });
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      plan: service.plan,
    },
  });
  useEffect(() => {
    errorMessageRef.current?.lastElementChild?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [form.formState.errors.plan]);
  const onSubmit = form.handleSubmit((formValues) => {
    updateService({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      data: {
        plan: formValues.plan,
      },
    });
  });

  const initialFlavorObject = listPlans
    .find((p) => p.name === service.plan)
    .regions.find((r) => r.name === service.nodes[0].region)
    .flavors.find((f) => f.name === service.flavor);
  const initialAddedStorage =
    service.storage?.size.value > 0 && service.storage.size.unit === 'GB'
      ? service.storage.size.value - initialFlavorObject.storage?.minimum.value
      : 0;

  const selectedPlan = form.watch('plan');

  const oldPrice = useMemo(() => {
    return computeServicePrice({
      offerPricing: initialFlavorObject.pricing,
      nbNodes: service.nodes.length,
      storagePricing: initialFlavorObject.storage?.pricing,
      additionalStorage: initialAddedStorage,
      storageMode: listEngines.find((e) => e.name === service.engine)
        .storageMode,
    });
  }, [service.flavor]);
  const newPrice = useMemo(() => {
    const flavorObject = listPlans
      .find((p) => p.name === selectedPlan)
      .regions.find((r) => r.name === service.nodes[0].region)
      .flavors.find((f) => f.name === service.flavor);
    return computeServicePrice({
      offerPricing: flavorObject.pricing,
      nbNodes: service.nodes.length,
      storagePricing: flavorObject.storage?.pricing,
      additionalStorage: initialAddedStorage,
      storageMode: listEngines.find((e) => e.name === service.engine)
        .storageMode,
    });
  }, [selectedPlan]);

  return (
    <Dialog {...controller}>
      <DialogContent className="px-0 sm:max-w-2xl">
        <ScrollArea className="max-h-[80vh] px-6">
          <Form {...form}>
            <form onSubmit={onSubmit} id="updatePlanForm">
              <DialogHeader className="mb-2">
                <DialogTitle>{t('updatePlanTitle')}</DialogTitle>
              </DialogHeader>
              <Label>{t('priceUnitSwitchLabel')}</Label>
              <PriceUnitSwitch
                showMonthly={showMonthly}
                onChange={setShowMonthly}
              />
              <FormField
                control={form.control}
                name="plan"
                render={({ field }) => (
                  <FormItem>
                    <div ref={errorMessageRef}>
                      <FormLabel>{t('updatePlanInputLabel')}</FormLabel>
                      <FormControl>
                        <PlansSelect
                          plans={listPlans}
                          value={field.value}
                          onChange={field.onChange}
                          showMonthlyPrice={showMonthly}
                          ref={field.ref}
                          className="grid-cols-1 md:grid-cols-1 xl:grid-cols-1 my-1 mr-1"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter className="flex sm:justify-between px-6">
          <div className="flex items-center gap-2">
            <Price
              priceInUcents={oldPrice[showMonthly ? 'monthly' : 'hourly'].price}
              taxInUcents={oldPrice[showMonthly ? 'monthly' : 'hourly'].tax}
              decimals={showMonthly ? 2 : 3}
            />
            <ArrowRight className="size-4" />
            <Price
              priceInUcents={newPrice[showMonthly ? 'monthly' : 'hourly'].price}
              taxInUcents={newPrice[showMonthly ? 'monthly' : 'hourly'].tax}
              decimals={showMonthly ? 2 : 3}
            />
          </div>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {t('updatePlanCancelButton')}
              </Button>
            </DialogClose>
            <Button form="updatePlanForm" disabled={isPending}>
              {t('updatePlanSubmitButton')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePlan;
