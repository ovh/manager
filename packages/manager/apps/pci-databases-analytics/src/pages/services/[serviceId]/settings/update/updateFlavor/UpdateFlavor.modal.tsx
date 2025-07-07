import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  ScrollArea,
  ScrollBar,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useToast,
} from '@datatr-ux/uxlib';
import FlavorsSelect from '@/components/order/flavor/FlavorSelect.component';
import * as database from '@/types/cloud/project/database';
import { useServiceData } from '@/pages/services/[serviceId]/Service.context';
import { useEditService } from '@/hooks/api/database/service/useEditService.hook';
import Price from '@/components/price/Price.component';
import StorageConfig from '@/components/order/cluster-configuration/StorageConfig.component';
import { formatStorage } from '@/lib/bytesHelper';
import PricingDetails from '../_components/PricingDetails.component';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useGetAvailabilities } from '@/hooks/api/database/availability/useGetAvailabilities.hook';
import { useUpdateFlavor } from './useUpdateFlavor.hook';
import RouteModal from '@/components/route-modal/RouteModal';

const UpdateFlavor = () => {
  const navigate = useNavigate();
  const { service, projectId } = useServiceData();
  const toast = useToast();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/settings/update',
  );
  const availabilitiesQuery = useGetAvailabilities(
    projectId,
    service.id,
    database.availability.ActionEnum.update,
    database.availability.TargetEnum.flavor,
  );
  const {
    form,
    listFlavors,
    availability,
    hasStorage,
    initialFlavorObject,
    oldPrice,
    newPrice,
  } = useUpdateFlavor({ availabilities: availabilitiesQuery.data, service });
  const { editService, isPending } = useEditService({
    onError: (err) => {
      toast.toast({
        title: t('updateFlavorToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
    },
    onEditSuccess: (updatedService) => {
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
      navigate('../');
    },
  });

  const onSubmit = form.handleSubmit((formValues) => {
    editService({
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
    <RouteModal
      isLoading={!listFlavors || !initialFlavorObject || !newPrice || !oldPrice}
    >
      <DialogContent className="sm:max-w-2xl">
        <ScrollArea className="max-h-[80vh] px-6">
          <Form {...form}>
            <form onSubmit={onSubmit} id="updateFlavorForm">
              <DialogHeader className="mb-2">
                <DialogTitle data-testid="update-flavor-modal">
                  {t('updateFlavorTitle')}
                </DialogTitle>
              </DialogHeader>
              <FormField
                control={form.control}
                name="flavor"
                render={({ field }) => (
                  <FormItem className="max-w-sm sm:max-w-full">
                    <FormLabel>{t('updateFlavorInputLabel')}</FormLabel>
                    <FormControl>
                      <FlavorsSelect
                        className="mb-1"
                        flavors={listFlavors}
                        value={field.value}
                        onChange={field.onChange}
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
            </form>
          </Form>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        <DialogFooter className="flex justify-between sm:justify-between mt-2 w-full gap-2">
          <div className="flex-col w-full">
            <div className="flex items-center gap-2">
              <Price
                priceInUcents={oldPrice?.servicePrice.hourly.price}
                taxInUcents={oldPrice?.servicePrice.hourly.tax}
                decimals={3}
              />
              <PricingDetails service={service} pricing={oldPrice} />
              <ArrowRight className="size-4" />
              <Price
                priceInUcents={newPrice?.servicePrice.hourly.price}
                taxInUcents={newPrice?.servicePrice.hourly.tax}
                decimals={3}
              />
              <PricingDetails service={service} pricing={newPrice} />
            </div>
            <div className="flex gap-2 mt-2 justify-end">
              <DialogClose asChild>
                <Button
                  data-testid="update-flavor-cancel-button"
                  type="button"
                  mode="outline"
                >
                  {t('updateFlavorCancelButton')}
                </Button>
              </DialogClose>
              <Button
                form="updateFlavorForm"
                disabled={isPending}
                data-testid="update-flavor-submit-button"
              >
                {t('updateFlavorSubmitButton')}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default UpdateFlavor;
