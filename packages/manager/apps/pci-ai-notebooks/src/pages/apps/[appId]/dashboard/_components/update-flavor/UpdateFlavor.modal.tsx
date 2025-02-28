import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import { useAppData } from '../../../App.context';
import RouteModal from '@/components/route-modal/RouteModal';
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useGetCatalog } from '@/hooks/api/catalog/useGetCatalog.hook';
import { useUpdateApp } from '@/hooks/api/ai/app/useUpdateApp.hook';
import FlavorsSelect from '@/components/order/flavor/FlavorSelect.component';
import { Input } from '@/components/ui/input';
import { useGetFlavor } from '@/hooks/api/ai/capabilities/useGetFlavor.hook';
import { Flavor } from '@/types/orderFunnel';
import { createFlavorPricingList } from '@/lib/priceFlavorHelper';
import * as ai from '@/types/cloud/project/ai';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const UpdateFlavor = () => {
  const { app, projectId } = useAppData();
  const catalogQuery = useGetCatalog({ refetchOnWindowFocus: false });
  const flavorQuery = useGetFlavor(projectId, app.spec.region);
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation('components/flavor');

  const listFlavor: Flavor[] = useMemo(() => {
    if (flavorQuery.isLoading || catalogQuery.isLoading) return [];
    return createFlavorPricingList(
      flavorQuery.data,
      catalogQuery.data,
      'ai-app',
    );
  }, [flavorQuery.isSuccess, catalogQuery.isSuccess]);

  const schema = z.object({
    flavorWithQuantity: z.object({
      flavor: z.string(),
      quantity: z.coerce.number(),
    }),
  });

  type ValidationSchema = z.infer<typeof schema>;

  const defaultValues: ValidationSchema = {
    flavorWithQuantity: {
      flavor: app.spec.resources.flavor,
      quantity:
        app.spec.resources.gpu > 0
          ? app.spec.resources.gpu
          : app.spec.resources.cpu,
    },
  };

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { updateApp, isPending } = useUpdateApp({
    onError: (err) => {
      toast.toast({
        title: t('updateImageToastErrorTitle'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
    },
    onUpdateSuccess: () => {
      toast.toast({
        title: t('updateImageToastSuccessTitle'),
        description: t('updateImageToastSuccessDescription'),
      });
      navigate('../');
    },
  });

  const onSubmit = form.handleSubmit((formValues) => {
    const updateAppInfo: ai.app.UpdateInput =
      listFlavor.find(
        (flav) => flav.id === formValues.flavorWithQuantity.flavor,
      ).type === ai.capabilities.FlavorTypeEnum.cpu
        ? {
            flavor: formValues.flavorWithQuantity.flavor,
            cpu: Number(formValues.flavorWithQuantity.quantity),
          }
        : {
            flavor: formValues.flavorWithQuantity.flavor,
            gpu: Number(formValues.flavorWithQuantity.quantity),
          };
    updateApp({ projectId, appId: app.id, appInfo: updateAppInfo });
  });

  return (
    <RouteModal backUrl="../" isLoading={!(listFlavor.length > 0)}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle data-testid="update-flavor-modal">
            {t('updateFlavorTitle')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <ScrollArea className="mx-2">
              <FormField
                control={form.control}
                name="flavorWithQuantity.flavor"
                render={({ field }) => (
                  <FormItem className="max-w-sm sm:max-w-full">
                    <FormControl>
                      <FlavorsSelect
                        {...field}
                        isUpdate={true}
                        flavors={listFlavor}
                        value={field.value}
                        resourcesQuantity={form.getValues(
                          'flavorWithQuantity.quantity',
                        )}
                        onChange={(newFlavor) => {
                          form.setValue('flavorWithQuantity.flavor', newFlavor);
                          form.setValue('flavorWithQuantity.quantity', 1);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                defaultValue={1}
                name="flavorWithQuantity.quantity"
                render={({ field }) => (
                  <FormItem>
                    <p className="mt-4 text-sm">
                      {t('fieldFlavorQuantityDescription')}
                    </p>
                    <FormControl className="px-2">
                      <Input
                        type="number"
                        max={
                          listFlavor.find(
                            (flav) =>
                              flav.id ===
                              form.getValues('flavorWithQuantity.flavor'),
                          )?.max
                        }
                        min={1}
                        value={field.value}
                        {...field}
                      />
                    </FormControl>
                    <div className="flex flex-row justify-between">
                      <FormMessage />
                      {form.getValues('flavorWithQuantity.quantity') > 1 && (
                        <div className="inline-block text-xs">
                          <span>{t('fieldFlavorQuantityInformation')}</span>{' '}
                          <span className="capitalize font-bold">
                            {form.getValues('flavorWithQuantity.flavor')}
                          </span>
                          {': '}
                          <span>
                            {
                              listFlavor.find(
                                (flav) =>
                                  flav.id ===
                                  form.getValues('flavorWithQuantity.flavor'),
                              )?.max
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </FormItem>
                )}
              />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <DialogFooter className="flex justify-end">
              <DialogClose asChild>
                <Button
                  data-testid="update-resources-cancel-button"
                  type="button"
                  variant="outline"
                >
                  {t('updateFlavorButtonCancel')}
                </Button>
              </DialogClose>
              <Button
                data-testid="update-resources-submit-button"
                type="submit"
                disabled={isPending}
              >
                {t('updateFlavorButtonConfirm')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </RouteModal>
  );
};

export default UpdateFlavor;
