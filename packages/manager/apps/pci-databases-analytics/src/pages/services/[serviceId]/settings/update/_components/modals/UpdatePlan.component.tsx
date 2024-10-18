import { useEffect, useMemo, useRef, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import PlansSelect from '@/components/order/plan/PlanSelect.component';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FullCapabilities } from '@/hooks/api/database/capabilities/useGetFullCapabilities.hook';
import { ModalController } from '@/hooks/useModale';
import { createTree } from '@/lib/availabilitiesHelper';
import { order } from '@/types/catalog';
import * as database from '@/types/cloud/project/database';
import { Engine, Version } from '@/types/orderFunnel';
import { useServiceData } from '@/pages/services/[serviceId]/Service.context';
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
import { useEditService } from '@/hooks/api/database/service/useEditService.hook';
import { computeServicePrice } from '@/lib/pricingHelper';
import Price from '@/components/price/Price.component';
import PriceUnitSwitch from '@/components/price-unit-switch/PriceUnitSwitch.component';
import { Label } from '@/components/ui/label';
import PricingDetails from '../PricingDetails.component';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';

interface UpdatePlanProps {
  controller: ModalController;
  suggestions: database.availability.Suggestion[];
  availabilities: database.Availability[];
  capabilities: FullCapabilities;
  catalog: order.publicOrder.Catalog;
  onSuccess?: (service: database.Service) => void;
  onError?: (error: Error) => void;
}

const UpdatePlanContent = ({
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
  const { editService, isPending } = useEditService({
    onError: (err) => {
      toast.toast({
        title: t('updatePlanToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
      if (onError) {
        onError(err);
      }
    },
    onEditSuccess: (updatedService) => {
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
    // Get the data to submit. We want to check the flavor for some edge cases
    // such as mongodb discovery, where the flavor must be updated with the plan
    const { flavors } = listPlans
      .find((p) => p.name === formValues.plan)
      .regions.find((r) => r.name === service.nodes[0].region);
    const flavor = flavors.find((f) => f.name === service.flavor) || flavors[0];
    const data = {
      plan: formValues.plan,
      ...(flavor.name !== service.flavor && {
        flavor: flavor.name,
      }),
    };
    editService({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      data,
    });
  });

  const initialFlavorObject = listPlans
    .find((p) => p.name === service.plan)
    .regions.find((r) => r.name === service.nodes[0].region)
    .flavors.find((f) => f.name === service.flavor);
  const hasStorage =
    service.storage?.size.value > 0 && service.storage.size.unit === 'GB';
  const initialAddedStorage =
    hasStorage && initialFlavorObject
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
    const plan = listPlans.find((p) => p.name === selectedPlan);
    const region = plan.regions.find((r) => r.name === service.nodes[0].region);
    const flavor =
      region.flavors.find((f) => f.name === service.flavor) ||
      region.flavors[0];
    const { storageMode } = listEngines.find((e) => e.name === service.engine);
    return computeServicePrice({
      offerPricing: flavor.pricing,
      nbNodes: Math.max(service.nodes.length, plan.nodes.minimum),
      storagePricing: flavor.storage?.pricing,
      additionalStorage: initialAddedStorage,
      storageMode,
    });
  }, [selectedPlan]);

  return (
    <Dialog {...controller}>
      <DialogContent className="px-0 sm:max-w-2xl">
        <ScrollArea className="max-h-[80vh] px-6">
          <Form {...form}>
            <form onSubmit={onSubmit} id="updatePlanForm">
              <DialogHeader className="mb-2">
                <DialogTitle data-testid="update-plan-modal">
                  {t('updatePlanTitle')}
                </DialogTitle>
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
              priceInUcents={
                oldPrice.servicePrice[showMonthly ? 'monthly' : 'hourly'].price
              }
              taxInUcents={
                oldPrice.servicePrice[showMonthly ? 'monthly' : 'hourly'].tax
              }
              decimals={showMonthly ? 2 : 3}
            />
            <PricingDetails
              service={service}
              pricing={oldPrice}
              showMonthly={showMonthly}
            />
            <ArrowRight className="size-4" />
            <Price
              priceInUcents={
                newPrice.servicePrice[showMonthly ? 'monthly' : 'hourly'].price
              }
              taxInUcents={
                newPrice.servicePrice[showMonthly ? 'monthly' : 'hourly'].tax
              }
              decimals={showMonthly ? 2 : 3}
            />
            <PricingDetails
              service={service}
              pricing={newPrice}
              showMonthly={showMonthly}
            />
          </div>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button
                data-testid="update-plan-cancel-button"
                type="button"
                variant="outline"
              >
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

const UpdatePlan = ({ controller, ...otherProps }: UpdatePlanProps) => {
  if (!controller.open) return <></>;
  return <UpdatePlanContent controller={controller} {...otherProps} />;
};

export default UpdatePlan;
