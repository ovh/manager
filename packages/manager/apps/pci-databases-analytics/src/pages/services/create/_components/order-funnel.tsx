import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';
import { A, H3, H4, P } from '@/components/typography';
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
import { cn } from '@/lib/utils';
import {
  ServiceCreationWithEngine,
  useAddService,
} from '@/hooks/api/services.api.hooks';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addService, isPending: isPendingAddService } = useAddService({
    onError: (err) => {
      toast({
        title: 'Error while creating service',
        variant: 'destructive',
        description: err.message,
      });
    },
    onSuccess: (service) => {
      toast({
        title: 'Service successfuly created',
      });
      navigate(`../${service.id}`);
    },
  });

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
      // data has been validated, create payload and submit post request
      const serviceInfos: ServiceCreationWithEngine = {
        description: data.name,
        engine: data.engineWithVersion.engine as database.EngineEnum,
        nodesPattern: {
          flavor: data.flavor,
          number: data.nbNodes,
          region: data.region,
        },
        plan: data.plan,
        version: data.engineWithVersion.version,
        ipRestrictions: data.ipRestrictions,
      };
      if (data.network.type === database.NetworkTypeEnum.private) {
        // endpoint does not expect the network id, but the linked openstackId instead
        const networkOpenstackId = model.result.network.network.regions.find(
          (r) => r.region.includes(data.region),
        ).openstackId;
        serviceInfos.networkId = networkOpenstackId;
        serviceInfos.subnetId = data.network.subnetId;
      }
      if (model.result.flavor.storage) {
        serviceInfos.disk = {
          size:
            model.result.flavor.storage.minimum.value + data.additionalStorage,
        };
      }
      addService(serviceInfos);
    },
    (error) => {
      toast({
        title: 'Incorrect form values',
        variant: 'destructive',
        description: (
          <div>
            <P className="text-white font-semibold">
              Some errors were found in the form:
            </P>
            <ul className="list-inside list-disc">
              {Object.keys(error).map((key) => (
                <li key={key}>{error[key as keyof typeof error].message}</li>
              ))}
            </ul>
          </div>
        ),
      });
    },
  );

  const scrollToDiv = (target: string) => {
    const div = document.getElementById(target);
    if (div) {
      div.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const classNameLabel = 'scroll-m-20 text-xl font-semibold';

  return (
    <>
      <H3 className="font-bold text-3xl mb-5">Create a database service</H3>
      <P className="mb-2">
        Create a database service available in your Public Cloud project.
      </P>
      <Alert variant="info" className="mb-2">
        <Info className="size-4" />
        <AlertDescription>
          If you would like to use a private network that does not yet exist,
          please create <A href="#">a private network or subnet</A> first.
        </AlertDescription>
      </Alert>

      <Form {...model.form}>
        <form
          className="grid grid-cols-1 lg:grid-cols-4 gap-4"
          onSubmit={onSubmit}
        >
          <div className="col-span-1 md:col-span-3 divide-y-[1rem] divide-transparent">
            <section id="engine">
              <FormField
                control={model.form.control}
                name="engineWithVersion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={classNameLabel}>Engine</FormLabel>
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
                    <FormLabel className={classNameLabel}>Plan</FormLabel>
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
                    <FormLabel className={classNameLabel}>Region</FormLabel>
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
                    <FormLabel className={classNameLabel}>Flavor</FormLabel>
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
                <section id="cluster" className="divide-y-4 divide-transparent">
                  <H4>Cluster configuration</H4>
                  {hasNodeSelection && (
                    <FormField
                      control={model.form.control}
                      name="nbNodes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={cn(classNameLabel, 'text-lg')}>
                            Nodes
                          </FormLabel>
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
                          <FormLabel className={cn(classNameLabel, 'text-lg')}>
                            Storage
                          </FormLabel>
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
                </section>
              )}
            <section id="options" className="divide-y-4 divide-transparent">
              <H4>Options</H4>
              {model.result.plan && (
                <FormField
                  control={model.form.control}
                  name="network"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(classNameLabel, 'text-lg')}>
                        network
                      </FormLabel>
                      <FormControl>
                        <NetworkOptions
                          {...field}
                          value={field.value}
                          onChange={(newNetwork) => {
                            console.log(newNetwork);
                            model.form.setValue('network', newNetwork);
                          }}
                          networks={model.lists.networks}
                          subnets={model.lists.subnets}
                          networkQuery={model.queries.networks}
                          subnetQuery={model.queries.subnets}
                          availableNetworks={model.result.plan.networks}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={model.form.control}
                name="ipRestrictions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(classNameLabel, 'text-lg')}>
                      ipRestrictions
                    </FormLabel>
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

          <Card className="sticky top-4 h-fit shadow-lg">
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
              <Button className="w-full" disabled={isPendingAddService}>
                Commander
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
};

export default OrderFunnel;
