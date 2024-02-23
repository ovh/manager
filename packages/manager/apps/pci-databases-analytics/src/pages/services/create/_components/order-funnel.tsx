import { useState } from 'react';
import { H3, H4 } from '@/components/typography';
import { useOrderFunnel } from '@/hooks/useOrderFunnel';
import { order } from '@/models/catalog';
import { database } from '@/models/database';
import EnginesSelect from './engine/engine-select';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import PlansSelect from './plan/plan-select';
import RegionsSelect from './region/region-select';
import FlavorsSelect from './flavor/flavor-select';
import StorageConfig from './cluster-config/storage-config';
import NodesConfig from './cluster-config/nodes-config';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Price from '@/components/price';
import OrderSummary from './order-summary';
import NetworkOptions from './cluster-options/network-options';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import IpsRestrictionsForm from './cluster-options/ips-restrictions-form';

interface OrderFunnelProps {
  availabilities: database.Availability[];
  capabilities: database.Capabilities;
  engineCapabilities: database.EngineCapabilities[];
  regionCapabilities: database.RegionCapabilities[];
  suggestions: database.Suggestion[];
  catalog: order.publicOrder.Catalog;
}

const OrderFunnel = ({
  availabilities,
  capabilities,
  engineCapabilities,
  regionCapabilities,
  suggestions,
  catalog,
}: OrderFunnelProps) => {
  const model = useOrderFunnel(
    availabilities,
    capabilities,
    engineCapabilities,
    regionCapabilities,
    suggestions,
    catalog,
  );
  const [showMonthlyPrice, setshowMonthlyPrice] = useState(false);
  const { toast } = useToast();

  const hasNodeSelection =
    model.result.plan &&
    model.result.plan.nodes.minimum !== model.result.plan.nodes.maximum;
  const hasStorageSelection =
    model.result.flavor &&
    model.result.flavor.storage &&
    model.result.flavor.storage.minimum.value !==
      model.result.flavor.storage.maximum.value;

  const onSubmit = model.form.handleSubmit(
    (data) => {
      toast({
        title: 'form submitted',
        description: <div>{JSON.stringify(data)}</div>,
      });
    },
    (error) => {
      toast({
        title: 'form submitted',
        variant: 'destructive',
        description: <div>{JSON.stringify(error)}</div>,
      });
    },
  );

  const scrollToDiv = (target: string) => {
    const div = document.getElementById(target);
    if (div) {
      div.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <h3 className="font-bold text-3xl mb-5">Create a database service</h3>
      <p>
        Create a database service available in your Public Cloud project. If you
        would like to use a private network that does not yet exist, please
        create{' '}
        <a className="text-primary font-bold" href="#">
          a private network or subnet
        </a>{' '}
        first.
      </p>
      <Form {...model.form}>
        <form
          className="grid grid-cols-1 lg:grid-cols-4 gap-4"
          onSubmit={onSubmit}
        >
          <div className="col-span-1 md:col-span-3">
            <section id="engine">
              <FormField
                control={model.form.control}
                name="engineWithVersion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Engine</FormLabel>
                    <FormControl>
                      <EnginesSelect
                        {...field}
                        engines={model.lists.engines}
                        value={field.value}
                        onChange={(newEngineWithVersion) =>
                          model.form.setValue(
                            'engineWithVersion',
                            newEngineWithVersion,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
            <section id="plan">
              <FormField
                control={model.form.control}
                name="plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan</FormLabel>
                    <FormControl>
                      <PlansSelect
                        {...field}
                        plans={model.lists.plans}
                        value={field.value}
                        onChange={(newPlan) =>
                          model.form.setValue('plan', newPlan)
                        }
                        showMonthlyPrice={showMonthlyPrice}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
            <section id="region">
              <FormField
                control={model.form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
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
                name="flavor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flavor</FormLabel>
                    <FormControl>
                      <FlavorsSelect
                        {...field}
                        flavors={model.lists.flavors}
                        value={field.value}
                        onChange={(newFlavor) =>
                          model.form.setValue('flavor', newFlavor)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            {model.result.availability &&
              (hasNodeSelection || hasStorageSelection) && (
                <section id="cluster">
                  <H3>Cluster config</H3>
                  <div className="divide-y-4">
                    {hasNodeSelection && (
                      <FormField
                        control={model.form.control}
                        name="nbNodes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nodes</FormLabel>
                            <FormControl>
                              <NodesConfig
                                {...field}
                                minimum={model.result.plan.nodes.minimum}
                                maximum={model.result.plan.nodes.maximum}
                                value={field.value}
                                onChange={(newNbNodes) =>
                                  model.form.setValue('nbNodes', newNbNodes)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    {hasStorageSelection && (
                      <FormField
                        control={model.form.control}
                        name="additionalStorage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Storage</FormLabel>
                            <FormControl>
                              <StorageConfig
                                {...field}
                                availability={model.result.availability}
                                value={field.value}
                                onChange={(newStorage) =>
                                  model.form.setValue(
                                    'additionalStorage',
                                    newStorage,
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </section>
              )}
            <section id="options">
              <H3>Options</H3>
              <FormField
                control={model.form.control}
                name="network"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>network</FormLabel>
                    <FormControl>
                      <NetworkOptions
                        {...field}
                        value={field.value}
                        onChange={(newNetwork) =>
                          model.form.setValue('network', newNetwork)
                        }
                        networks={model.lists.networks}
                        subnets={model.lists.subnets}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <H4>IPs restrictions</H4>
              <FormField
                control={model.form.control}
                name="ipRestrictions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ipRestrictions</FormLabel>
                    <FormControl>
                      <IpsRestrictionsForm
                        {...field}
                        value={field.value}
                        onChange={(newIps) =>
                          model.form.setValue('ipRestrictions', newIps)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
          </div>

          <Card className="sticky lg:mt-16 top-8 h-fit shadow-lg">
            <CardHeader>
              <CardTitle>Votre commande</CardTitle>
              <CardDescription>Configuration de votre service</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderSummary
                order={model.result}
                onSectionClicked={(section) => scrollToDiv(section)}
              />
              <div>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 mb-2">
                    <Switch
                      className="rounded-xl"
                      id="price-unit"
                      checked={showMonthlyPrice}
                      onCheckedChange={(checked) =>
                        setshowMonthlyPrice(checked)
                      }
                    />
                    <Label htmlFor="availabilities-table">Monthly prices</Label>
                  </div>
                  <div className="flex items-baseline">
                    <Price
                      decimals={showMonthlyPrice ? 2 : 3}
                      priceInUcents={
                        model.result.price[
                          showMonthlyPrice ? 'monthly' : 'hourly'
                        ].price
                      }
                      taxInUcents={
                        model.result.price[
                          showMonthlyPrice ? 'monthly' : 'hourly'
                        ].tax
                      }
                    />
                    {showMonthlyPrice ? '/mois' : '/heure'}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button className="w-full">Commander</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
};

export default OrderFunnel;
