import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { useOrderFunnel } from './useOrderFunnel.hook';
import { order } from '@/types/catalog';
import * as database from '@/types/cloud/project/database';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import StorageConfig from '@/components/order/cluster-configuration/StorageConfig.component';
import NodesConfig from '@/components/order/cluster-configuration/NodesConfig.component';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import {
  ServiceCreationWithEngine,
  useAddService,
} from '@/hooks/api/database/service/useAddService.hook';
import PriceUnitSwitch from '@/components/price-unit-switch/PriceUnitSwitch.component';
import EnginesSelect from '@/components/order/engine/EngineSelect.component';
import PlansSelect from '@/components/order/plan/PlanSelect.component';
import FlavorsSelect from '@/components/order/flavor/FlavorSelect.component';
import NetworkOptions from '@/components/order/cluster-options/NetworkOptions.components';
import IpsRestrictionsForm from '@/components/order/cluster-options/IpsRestrictionsForm.component';
import RegionsSelect from '@/components/order/region/RegionSelect.component';
import OrderPrice from '@/components/order/price/OrderPrice.component';
import OrderSummary from './OrderSummary.component';
import ErrorList from '@/components/order/error-list/ErrorList.component';
import { FullCapabilities } from '@/hooks/api/database/capabilities/useGetFullCapabilities.hook';
import usePciProject from '@/hooks/api/project/usePciProject.hook';
import { Alert, AlertDescription } from '@/components/ui/alert';
import OvhLink from '@/components/links/OvhLink.component';
import { PlanCode } from '@/types/cloud/Project';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { usePostTracking } from '@/hooks/api/tracking/usePostTracking.hook';
import { useBeforeUnload } from '@/hooks/useBeforeUnload.hook';

interface OrderFunnelProps {
  availabilities: database.Availability[];
  capabilities: FullCapabilities;
  suggestions: database.availability.Suggestion[];
  catalog: order.publicOrder.Catalog;
}

const OrderFunnel = ({
  availabilities,
  capabilities,
  suggestions,
  catalog,
}: OrderFunnelProps) => {
  const model = useOrderFunnel(
    availabilities,
    capabilities,
    suggestions,
    catalog,
  );

  // mutation to post the tracking
  const { postTracking } = usePostTracking({
    onError: (err) => {
      console.log(err);
    },
    onSuccess: () => {
      console.log('posted tracking');
    },
  });

  const { BeforeUnloadDialog, setEnabled } = useBeforeUnload({
    onUnload: useCallback(() => {
      postTracking(
        `${model.result.engine?.name}-${model.result.plan?.name}-${model.result.region?.name}-${model.result.flavor?.name}`,
      );
    }, [model]),
  });

  const projectData = usePciProject();
  const [showMonthlyPrice, setShowMonthlyPrice] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation('pci-databases-analytics/services/new');
  const { addService, isPending: isPendingAddService } = useAddService({
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
      setEnabled(true);
      navigate(`../${service.id}`);
    },
  });

  const isProjectDiscoveryMode =
    projectData.data?.planCode === PlanCode.DISCOVERY;
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
    <>
      {BeforeUnloadDialog}
      {isProjectDiscoveryMode && (
        <Alert variant="warning">
          <AlertDescription className="text-base">
            <div
              data-testid="discovery-container"
              className="flex flex-col items-stretch  md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex flex-row gap-5 items-center">
                <AlertCircle className="h-6 w-6" />
                <p>{t('discoveryMode')}</p>
              </div>
              <Button variant="default" type="button" asChild>
                <OvhLink
                  className="hover:no-underline hover:text-primary-foreground"
                  application="public-cloud"
                  path={`#/pci/projects/${projectData.data?.project_id}/activate`}
                >
                  {t('discoveryModeActivate')}
                  <ArrowRight className="w-4 h-4 ml-2 mt-1" />
                </OvhLink>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      <Form {...model.form}>
        <form
          className="grid grid-cols-1 lg:grid-cols-4 gap-4"
          onSubmit={onSubmit}
        >
          <div
            data-testid="order-funnel-container"
            className="col-span-1 md:col-span-3 divide-y-[1rem] divide-transparent"
          >
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

            {model.result.availability &&
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
              )}
            <section
              id="options"
              className="divide-y-[1rem] divide-transparent"
            >
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
              <Button
                data-testid="order-submit-button"
                className="w-full"
                disabled={isPendingAddService || isProjectDiscoveryMode}
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
