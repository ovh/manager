import { useTranslation } from 'react-i18next';
import * as ai from '@/types/cloud/project/ai';
import { order } from '@/types/catalog';
import { useOrderFunnel } from './useOrderFunnel.hook';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import OrderSummary from './OrderSummary.component';
import { Button } from '@/components/ui/button';
import RegionsSelect from '@/components/order/region/RegionSelect.component';
import FlavorsSelect from '@/components/order/flavor/FlavorSelect.component';
import { Input } from '@/components/ui/input';
import OrderPrice from '@/components/order/price/OrderPrice.component';
import FrameworksSelect from '@/components/order/framework/FrameworkSelect.component';
import EditorsSelect from '@/components/order/editor/EditorSelect.component';

interface OrderFunnelProps {
  regions: ai.capabilities.Region[];
  catalog: order.publicOrder.Catalog;
  frameworks: ai.capabilities.notebook.Framework[];
  editors: ai.capabilities.notebook.Editor[];
}

const OrderFunnel = ({
  regions,
  catalog,
  frameworks,
  editors,
}: OrderFunnelProps) => {
  const model = useOrderFunnel(regions, catalog, frameworks, editors);
  const { t } = useTranslation('pci-ai-notebooks/notebooks/create');

  /* const { addNotebook, isPending: isPendingAddNotebook } = useAddService({
    onError: (err) => {
      toast({
        title: t('errorCreatingService'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
    },
    onSuccess: (service) => {
      toast({
        title: t('successCreatingService'),
      });
      navigate(`../${service.id}`);
    },
  });
  */

  const onSubmit = model.form.handleSubmit((data) => {
    console.log(data);
  });

  const scrollToDiv = (target: string) => {
    const div = document.getElementById(target);
    if (div) {
      div.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const classNameLabel = 'scroll-m-20 text-xl font-semibold';

  return (
    <>
      <Form {...model.form}>
        <form
          className="grid grid-cols-1 lg:grid-cols-4 gap-4"
          onSubmit={onSubmit}
        >
          <div
            data-testid="order-funnel-container"
            className="col-span-1 md:col-span-3 divide-y-[1rem] divide-transparent"
          >
            <section id="region">
              <FormField
                control={model.form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={classNameLabel}>
                      {t('fieldRegionLabel')}
                    </FormLabel>
                    <FormControl>
                      <RegionsSelect
                        {...field}
                        regions={model.lists.regions}
                        value={field.value}
                        onChange={(newRegion) =>
                          model.form.setValue('region', newRegion)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
            <section id="flavor">
              <FormField
                control={model.form.control}
                name="flavorWithQuantity.flavor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={classNameLabel}>
                      {t('fieldFlavorLabel')}
                    </FormLabel>
                    <p>{t('fieldFlavorDescription')}</p>
                    <FormControl>
                      <FlavorsSelect
                        {...field}
                        flavors={model.lists.flavors}
                        value={field.value}
                        resourcesQuantity={model.result.resourcesQuantity}
                        onChange={(newFlavor) => {
                          model.form.setValue(
                            'flavorWithQuantity.flavor',
                            newFlavor,
                          );
                          model.form.setValue('flavorWithQuantity.quantity', 1);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={model.form.control}
                name="flavorWithQuantity.quantity"
                render={({ field }) => (
                  <FormItem>
                    <p className="mt-2">
                      {t('fieldFlavorQuantityDescription')}
                    </p>
                    <FormControl>
                      <Input
                        type="number"
                        max={model.result?.flavor?.max}
                        min={1}
                        value={field.value}
                        {...field}
                      />
                    </FormControl>
                    <div className="flex flex-row justify-between">
                      <FormMessage />
                      {model.result.flavor && (
                        <div className="inline-block text-xs">
                          <span>{t('fieldFlavorQuantityInformation')}</span>{' '}
                          <span className="capitalize font-bold">
                            {model.result?.flavor?.id}
                          </span>
                          {': '}
                          <span>{model.result?.flavor?.max}</span>
                        </div>
                      )}
                    </div>
                  </FormItem>
                )}
              />
            </section>
            <section id="framework">
              <FormField
                control={model.form.control}
                name="frameworkWithVersion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={classNameLabel}>
                      {t('fieldFrameworkLabel')}
                    </FormLabel>
                    <FormControl>
                      <FrameworksSelect
                        {...field}
                        frameworks={model.lists.frameworks}
                        value={field.value}
                        onChange={(newFrameworkWithVersion) =>
                          model.form.setValue(
                            'frameworkWithVersion',
                            newFrameworkWithVersion,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
            <section id="editor">
              <FormField
                control={model.form.control}
                name="editor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={classNameLabel}>
                      {t('fieldEditorLabel')}
                    </FormLabel>
                    <FormControl>
                      <EditorsSelect
                        {...field}
                        editors={model.lists.editors}
                        value={field.value}
                        onChange={(newEditor) =>
                          model.form.setValue('editor', newEditor)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
          </div>
          <Card className="sticky top-4 h-fit shadow-lg">
            <CardHeader>
              <CardTitle>{t('summaryTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              <OrderSummary
                order={model.result}
                onSectionClicked={(section) => scrollToDiv(section)}
              />
              {model.result.flavor && (
                <OrderPrice
                  price={model.result.flavor.pricing[0]}
                  quantity={model.result.resourcesQuantity}
                />
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                data-testid="order-submit-button"
                className="w-full"
                // disabled={isPendingAddService || isProjectDiscoveryMode}
              >
                {t('orderButton')}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
};
export default OrderFunnel;
