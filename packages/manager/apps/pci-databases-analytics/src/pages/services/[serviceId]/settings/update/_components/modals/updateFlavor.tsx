import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import FlavorsSelect from '@/components/Order/flavor/flavor-select';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { FullCapabilities } from '@/hooks/api/availabilities.api.hooks';
import { ModalController } from '@/hooks/useModale';
import { createTree } from '@/lib/availabilitiesHelper';
import { order } from '@/models/catalog';
import { database } from '@/models/database';
import { Engine, Version, Plan, Region } from '@/models/order-funnel';
import { useServiceData } from '@/pages/services/[serviceId]/layout';
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
import Price from '@/components/price';
import { computeServicePrice } from '@/lib/pricingHelper';
import StorageConfig from '@/components/Order/cluster-config/storage-config';
import { formatStorage } from '@/lib/bytesHelper';
import PriceUnitSwitch from '@/components/price-unit-switch';
import { Label } from '@/components/ui/label';

interface UpdateFlavorProps {
  controller: ModalController;
  suggestions: database.Suggestion[];
  availabilities: database.Availability[];
  capabilities: FullCapabilities;
  catalog: order.publicOrder.Catalog;
  onSuccess?: (service: database.Service) => void;
  onError?: (error: Error) => void;
}

const UpdateFlavor = ({
  controller,
  suggestions,
  availabilities,
  capabilities,
  catalog,
  onSuccess,
  onError,
}: UpdateFlavorProps) => {
  const [showMonthly, setShowMonthly] = useState(false);
  const { service, projectId } = useServiceData();
  const toast = useToast();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/settings/update',
  );
  const hasStorage =
    service.storage?.size.value > 0 && service.storage.size.unit === 'GB';
  const { updateService, isPending } = useUpdateService({
    onError: (err) => {
      toast.toast({
        title: t('updateFlavorToastErrorTitle'),
        variant: 'destructive',
        description: err.response.data.message,
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: (updatedService) => {
      toast.toast({
        title: t('updateFlavorToastSuccessTitle'),
        description: hasStorage
          ? t('updateFlavorAndStorageToastSuccessDescription', {
              newFlavor: updatedService.flavor,
              storage: formatStorage(updatedService.storage.size),
            })
          : t('updateFlavorToastSuccessDescription', {
              newFlavor: updatedService.flavor,
            }),
      });
      if (onSuccess) {
        onSuccess(updatedService);
      }
    },
  });
  const listEngines = useMemo(
    () => createTree(availabilities, capabilities, suggestions, catalog),
    [availabilities, capabilities],
  );
  const listFlavors = useMemo(
    () =>
      listEngines
        ?.find((e: Engine) => e.name === service.engine)
        ?.versions.find((v: Version) => v.name === service.version)
        ?.plans.find((p: Plan) => p.name === service.plan)
        ?.regions.find((r: Region) => r.name === service.nodes[0].region)
        ?.flavors.sort((a, b) => a.order - b.order) || [],
    [listEngines, service],
  );

  const initialFlavorObject = useMemo(
    () => listFlavors.find((f) => f.name === service.flavor),
    [service.flavor, listFlavors],
  );
  const initialAddedStorage = hasStorage
    ? service.storage.size.value - initialFlavorObject.storage?.minimum.value
    : 0;

  const schema = z.object({
    flavor: z.string().min(1),
    storage: z.coerce.number().nonnegative(),
  });
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      flavor: service.flavor,
      storage: initialAddedStorage,
    },
  });

  const selectedFlavor = form.watch('flavor');
  const selectedStorage = form.watch('storage');
  const flavorObject = useMemo(
    () => listFlavors.find((f) => f.name === selectedFlavor),
    [selectedFlavor],
  );
  const availability = useMemo(
    () =>
      availabilities.find(
        (a) =>
          a.engine === service.engine &&
          a.specifications.flavor === selectedFlavor &&
          a.plan === service.plan &&
          a.region === service.nodes[0].region,
      ),
    [availabilities, service, selectedFlavor],
  );

  useEffect(() => {
    form.setValue(
      'storage',
      selectedFlavor === service.flavor ? initialAddedStorage : 0,
    );
  }, [selectedFlavor]);

  const oldPrice = useMemo(() => {
    const initialFlavor = listFlavors.find((f) => f.name === service.flavor);
    return computeServicePrice({
      offerPricing: initialFlavor.pricing,
      nbNodes: service.nodes.length,
      storagePricing: initialFlavor.storage?.pricing,
      additionalStorage: initialAddedStorage,
      storageMode: listEngines.find((e) => e.name === service.engine)
        .storageMode,
    });
  }, [service.flavor]);
  const newPrice = useMemo(() => {
    return computeServicePrice({
      offerPricing: flavorObject.pricing,
      nbNodes: service.nodes.length,
      storagePricing: flavorObject.storage?.pricing,
      additionalStorage: selectedStorage,
      storageMode: listEngines.find((e) => e.name === service.engine)
        .storageMode,
    });
  }, [flavorObject, selectedStorage]);

  const onSubmit = form.handleSubmit((formValues) => {
    updateService({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      data: {
        flavor: formValues.flavor,
        ...(hasStorage && {
          disk: {
            size:
              availability.specifications.storage.minimum.value +
              formValues.storage,
          },
        }),
      },
    });
  });
  return (
    <Dialog {...controller}>
      <DialogContent className="sm:max-w-2xl">
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DialogHeader className="mb-2">
              <DialogTitle>{t('updateFlavorTitle')}</DialogTitle>
            </DialogHeader>
            <Label>{t('priceUnitSwitchLabel')}</Label>
            <PriceUnitSwitch
              showMonthly={showMonthly}
              onChange={setShowMonthly}
            />
            <ScrollArea>
              <FormField
                control={form.control}
                name="flavor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('updateFlavorInputLabel')}</FormLabel>
                    <FormControl>
                      <FlavorsSelect
                        className="mb-1"
                        flavors={listFlavors}
                        value={field.value}
                        onChange={field.onChange}
                        showMonthlyPrice={showMonthly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {hasStorage && (
                <FormField
                  control={form.control}
                  name="storage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('updateStorageInputLabel')}</FormLabel>
                      <FormControl>
                        <StorageConfig
                          availability={availability}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="flex gap-2">
                        <b>{t('updateStorageTotal')}</b>
                        <span>
                          {formatStorage({
                            unit: 'GB',
                            value:
                              availability.specifications.storage.minimum
                                .value + field.value,
                          })}
                        </span>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <DialogFooter className="flex justify-between sm:justify-between mt-2 w-full gap-2">
              <div className="flex items-center gap-2">
                <Price
                  priceInUcents={
                    oldPrice[showMonthly ? 'monthly' : 'hourly'].price
                  }
                  taxInUcents={oldPrice[showMonthly ? 'monthly' : 'hourly'].tax}
                  decimals={showMonthly ? 2 : 3}
                />
                <ArrowRight className="size-4" />
                <Price
                  priceInUcents={
                    newPrice[showMonthly ? 'monthly' : 'hourly'].price
                  }
                  taxInUcents={newPrice[showMonthly ? 'monthly' : 'hourly'].tax}
                  decimals={showMonthly ? 2 : 3}
                />
              </div>
              <div className="flex gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    {t('updateFlavorCancelButton')}
                  </Button>
                </DialogClose>
                <Button disabled={isPending}>
                  {t('updateFlavorSubmitButton')}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateFlavor;
