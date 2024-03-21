import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { order } from '@/models/catalog';
import { database } from '@/models/database';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import StorageConfig from '@/components/Order/cluster-config/storage-config';
import NodesConfig from '@/components/Order/cluster-config/nodes-config';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import {
  ServiceCreationWithEngine,
  useAddService,
} from '@/hooks/api/services.api.hooks';
import PriceUnitSwitch from '@/components/price-unit-switch';
import PlansSelect from '@/components/Order/plan/plan-select';
import FlavorsSelect from '@/components/Order/flavor/flavor-select';
import NetworkOptions from '@/components/Order/cluster-options/network-options';
import IpsRestrictionsForm from '@/components/Order/cluster-options/ips-restrictions-form';
import RegionsSelect from '@/components/Order/region/region-select';
import OrderPrice from '@/components/Order/order-price';
import { useUpdate } from './useUpdate';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import FormattedDate from '@/components/table-date';
import { formatStorage } from '@/lib/bytesHelper';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useServiceData } from '../../../layout';
import ErrorList from '@/components/Order/error-list';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TimePicker } from '@/components/ui/time-picker';
import { useDateFnsLocale } from '@/hooks/useDateFnsLocale.hook';
import { FullCapabilities } from '@/hooks/api/availabilities.api.hooks';
import { UpdateInitialValue } from '..';
import EnginesSelect from '@/components/Order/engine/engine-select';
import UpdateSummary from './update-summary';

interface UpdateFormProps {
  availabilities: database.Availability[];
  capabilities: FullCapabilities;
  initialValue: UpdateInitialValue;
  catalog: order.publicOrder.Catalog;
}

const UpdateForm = ({
  availabilities,
  capabilities,
  initialValue,
  catalog,
}: UpdateFormProps) => {
  const model = useUpdate(availabilities, capabilities, initialValue, catalog);
  const [showMonthlyPrice, setShowMonthlyPrice] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/backups/fork',
  );
  const { projectId } = useServiceData();
  const dateLocale = useDateFnsLocale();
  const { addService, isPending: isPendingAddService } = useAddService({
    onError: (err) => {
      toast({
        title: t('errorCreatingService'),
        variant: 'destructive',
        description: err.message,
      });
    },
    onSuccess: (fork) => {
      toast({
        title: t('successCreatingService'),
      });
      navigate(
        `/pci/projects/${projectId}/databases-analytics/${fork.category}/services/${fork.id}`,
      );
    },
  });

  const hasNodeSelection =
    model.result.plan &&
    model.result.plan.nodes.minimum !== model.result.plan.nodes.maximum;
  const hasStorageSelection =
    model.result.flavor?.storage &&
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
        title: t('errorFormTitle'),
        variant: 'destructive',
        description: <ErrorList error={error} />,
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
    <Form {...model.form}>
      <form
        className="grid grid-cols-1 lg:grid-cols-4 gap-4"
        onSubmit={onSubmit}
      >
        <div className="col-span-1 md:col-span-3 divide-y-[1rem] divide-transparent">
          {model.lists.engines.length > 0 &&
            model.lists.engines[0].versions.length > 1 && (
              <section id="engine">
                <FormField
                  control={model.form.control}
                  name="engineWithVersion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={classNameLabel}>
                        {t('fieldEngineLabel')}
                      </FormLabel>
                      <p>{t('fieldEngineDescription')}</p>
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
            )}
          {model.lists.plans.length > 1 && (
            <section id="plan">
              <FormField
                control={model.form.control}
                name="plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={classNameLabel}>
                      {t('fieldPlanLabel')}
                    </FormLabel>
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
          )}
          {model.lists.regions.length > 1 && (
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
          )}
          {model.lists.flavors.length > 1 && (
            <section id="flavor">
              <FormField
                control={model.form.control}
                name="flavor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={classNameLabel}>
                      {t('fieldFlavorLabel')}
                    </FormLabel>
                    <p>{t('fieldFlavorDescription')}</p>
                    <FormControl>
                      <FlavorsSelect
                        {...field}
                        showMonthlyPrice={showMonthlyPrice}
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
          )}

          {/* {model.result.availability &&
            (hasNodeSelection || hasStorageSelection) && (
              <section
                id="cluster"
                className="divide-y-[1rem] divide-transparent"
              >
                <h4>{t('sectionClusterTitle')}</h4>
                {hasNodeSelection && (
                  <FormField
                    control={model.form.control}
                    name="nbNodes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(classNameLabel, 'text-lg')}>
                          {t('fieldNodesLabel')}
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
                          {t('fieldStorageLabel')}
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
            )} */}
          {/* <section id="options" className="divide-y-[1rem] divide-transparent">
            <h4>{t('sectionOptionsTitle')}</h4>
            {model.result.plan && (
              <FormField
                control={model.form.control}
                name="network"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(classNameLabel, 'text-lg')}>
                      {t('fieldNetworkLabel')}
                    </FormLabel>
                    <FormControl>
                      <NetworkOptions
                        {...field}
                        value={field.value}
                        onChange={(newNetwork) =>
                          model.form.setValue('network', newNetwork)
                        }
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
                    {t('fieldIpsLabel')}
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
          </section> */}
        </div>

        <Card className="sticky top-4 h-fit shadow-lg">
          <CardHeader>
            <CardTitle>{t('summaryTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2">
            <UpdateSummary
              order={model.result}
              onSectionClicked={(section) => scrollToDiv(section)}
            />
            <PriceUnitSwitch
              showMonthly={showMonthlyPrice}
              onChange={(newPriceUnit) => setShowMonthlyPrice(newPriceUnit)}
            />
            <OrderPrice
              showMonthly={showMonthlyPrice}
              prices={model.result.price}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button className="w-full" disabled={isPendingAddService}>
              {t('orderButton')}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default UpdateForm;
