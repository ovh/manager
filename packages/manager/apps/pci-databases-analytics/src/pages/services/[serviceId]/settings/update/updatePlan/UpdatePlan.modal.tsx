import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import {
  Button,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  ScrollArea,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useToast,
  Label,
} from '@datatr-ux/uxlib';
import PlansSelect from '@/components/order/plan/PlanSelect.component';
import * as database from '@/types/cloud/project/database';
import { useServiceData } from '@/pages/services/[serviceId]/Service.context';
import { useEditService } from '@/hooks/api/database/service/useEditService.hook';
import Price from '@/components/price/Price.component';
import PriceUnitSwitch from '@/components/price-unit-switch/PriceUnitSwitch.component';
import PricingDetails from '../_components/PricingDetails.component';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useGetAvailabilities } from '@/hooks/api/database/availability/useGetAvailabilities.hook';
import { useUpdatePlan } from './useUpdatePlan.hook';
import RouteModal from '@/components/route-modal/RouteModal';

const UpdatePlan = () => {
  const [showMonthly, setShowMonthly] = useState(false);
  const navigate = useNavigate();
  const { service, projectId } = useServiceData();
  const errorMessageRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/settings/update',
  );
  const availabilitiesQuery = useGetAvailabilities(
    projectId,
    service.id,
    database.availability.ActionEnum.update,
    database.availability.TargetEnum.plan,
  );

  const {
    form,
    listPlans,
    initialFlavorObject,
    oldPrice,
    newPrice,
  } = useUpdatePlan({ availabilities: availabilitiesQuery.data, service });

  const { editService, isPending } = useEditService({
    onError: (err) => {
      toast.toast({
        title: t('updatePlanToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
    },
    onEditSuccess: (updatedService) => {
      toast.toast({
        title: t('updatePlanToastSuccessTitle'),
        description: t('updatePlanToastSuccessDescription', {
          newPlan: updatedService.plan,
        }),
      });
      navigate('../');
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

  return (
    <RouteModal
      isLoading={!listPlans || !initialFlavorObject || !newPrice || !oldPrice}
    >
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
          <div className="flex-col w-full">
            <div className="flex items-center gap-2">
              <Price
                priceInUcents={
                  oldPrice?.servicePrice[showMonthly ? 'monthly' : 'hourly']
                    .price
                }
                taxInUcents={
                  oldPrice?.servicePrice[showMonthly ? 'monthly' : 'hourly'].tax
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
                  newPrice?.servicePrice[showMonthly ? 'monthly' : 'hourly']
                    .price
                }
                taxInUcents={
                  newPrice?.servicePrice[showMonthly ? 'monthly' : 'hourly'].tax
                }
                decimals={showMonthly ? 2 : 3}
              />
              <PricingDetails
                service={service}
                pricing={newPrice}
                showMonthly={showMonthly}
              />
            </div>
            <div className="flex gap-2 mt-2 justify-end">
              <DialogClose asChild>
                <Button
                  data-testid="update-plan-cancel-button"
                  type="button"
                  mode="outline"
                >
                  {t('updatePlanCancelButton')}
                </Button>
              </DialogClose>
              <Button
                form="updatePlanForm"
                disabled={isPending}
                data-testid="update-plan-submit-button"
              >
                {t('updatePlanSubmitButton')}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default UpdatePlan;
