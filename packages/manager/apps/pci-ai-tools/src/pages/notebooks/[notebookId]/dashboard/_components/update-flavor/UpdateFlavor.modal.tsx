import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
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
  Input,
  ScrollArea,
  ScrollBar,
  useToast,
} from '@datatr-ux/uxlib';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import { useNotebookData } from '../../../Notebook.context';
import RouteModal from '@/components/route-modal/RouteModal';
import FlavorsSelect from '@/components/order/flavor/FlavorSelect.component';
import { Flavor } from '@/types/orderFunnel';
import { createFlavorPricingList } from '@/lib/priceFlavorHelper';
import { useGetCatalog } from '@/data/hooks/catalog/useGetCatalog.hook';
import { useGetFlavor } from '@/data/hooks/ai/capabilities/useGetFlavor.hook';
import { useUpdateNotebook } from '@/data/hooks/ai/notebook/useUpdateNotebook.hook';
import ai from '@/types/AI';

const UpdateFlavor = () => {
  const { notebook, projectId } = useNotebookData();
  const catalogQuery = useGetCatalog({ refetchOnWindowFocus: false });
  const flavorQuery = useGetFlavor(projectId, notebook.spec.region);
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation('ai-tools/components/flavor');

  const listFlavor: Flavor[] = useMemo(() => {
    if (flavorQuery.isLoading || catalogQuery.isLoading) return [];
    return createFlavorPricingList(
      flavorQuery.data,
      catalogQuery.data,
      'ai-notebook',
    );
  }, [flavorQuery.isSuccess, catalogQuery.isSuccess]);

  const schema = z.object({
    flavor: z.string(),
    quantity: z.coerce.number(),
  });

  type ValidationSchema = z.infer<typeof schema>;

  const defaultValues: ValidationSchema = {
    flavor: notebook.spec.resources.flavor,
    quantity:
      notebook.spec.resources.gpu > 0
        ? notebook.spec.resources.gpu
        : notebook.spec.resources.cpu,
  };

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const flavor = form.watch('flavor');
  const quantity = form.watch('quantity');

  const { updateNotebook, isPending } = useUpdateNotebook({
    onError: (err) => {
      toast.toast({
        title: t('updateFlavorToastErrorTitle'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
    },
    onUpdateSuccess: () => {
      toast.toast({
        title: t('updateFlavorToastSuccessTitle'),
        description: t('updateFlavorToastSuccessDescription'),
      });
      navigate('../');
    },
  });

  const onSubmit = form.handleSubmit((formValues) => {
    const updateNotebookInfo: ai.notebook.NotebookUpdate =
      listFlavor.find((flav) => flav.id === formValues.flavor).type ===
      ai.capabilities.FlavorTypeEnum.cpu
        ? {
            resources: {
              flavor: formValues.flavor,
              cpu: Number(formValues.quantity),
            },
          }
        : {
            resources: {
              flavor: formValues.flavor,
              gpu: Number(formValues.quantity),
            },
          };
    updateNotebook({
      projectId,
      notebookId: notebook.id,
      notebookInfo: updateNotebookInfo,
    });
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
                name="flavor"
                render={({ field }) => (
                  <FormItem className="max-w-sm sm:max-w-full">
                    <FormControl>
                      <FlavorsSelect
                        {...field}
                        flavors={listFlavor}
                        value={flavor}
                        isUpdate={true}
                        resourcesQuantity={quantity}
                        onChange={(newFlavor) => {
                          form.setValue('flavor', newFlavor);
                          form.setValue('quantity', 1);
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
                name="quantity"
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
                            (flav) => flav.id === form.getValues('flavor'),
                          )?.max
                        }
                        min={1}
                        value={quantity}
                        {...field}
                      />
                    </FormControl>
                    <div className="flex flex-row justify-between">
                      <FormMessage />
                      {form.getValues('quantity') > 1 && (
                        <div className="inline-block text-xs">
                          <span>{t('fieldFlavorQuantityInformation')}</span>{' '}
                          <span className="capitalize font-bold">
                            {form.getValues('flavor')}
                          </span>
                          {': '}
                          <span>
                            {
                              listFlavor.find(
                                (flav) => flav.id === form.getValues('flavor'),
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
                  data-testid="update-flavor-cancel-button"
                  type="button"
                  mode="outline"
                >
                  {t('updateFlavorButtonCancel')}
                </Button>
              </DialogClose>
              <Button
                data-testid="update-flavor-submit-button"
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
