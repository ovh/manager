import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useToast,
  Separator,
} from '@datatr-ux/uxlib';
import { useOrderFunnel } from './useOrderFunnel.hook';
import { order } from '@/types/catalog';
import * as database from '@/types/cloud/project/database';
import StorageConfig from '@/components/order/cluster-configuration/StorageConfig.component';
import NodesConfig from '@/components/order/cluster-configuration/NodesConfig.component';
import {
  ServiceCreationWithEngine,
  useAddService,
} from '@/hooks/api/database/service/useAddService.hook';
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
import { PlanCode } from '@/types/cloud/Project';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import ApiTerraformDialog from './ApiTerraformDialog.component';
import DiscoveryBanner from '@/components/discovery-banner/DiscoveryBanner';
import OrderSection from '@/components/order/Section.component';
import VersionSelect from '@/components/order/version/VersionSelect.component';
import NameInput from '@/components/order/name/NameInput.component';

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
  const { projectId } = useParams();
  const projectData = usePciProject();
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
      navigate(
        `/pci/projects/${projectId}/databases-analytics/${service.category}/services/${service.id}`,
      );
      toast({
        title: t('successCreatingService'),
      });
    },
  });

  const isProjectDiscoveryMode =
    projectData.data?.planCode === PlanCode.DISCOVERY;
  const hasStorageSelection =
    model.result.availability &&
    model.result.flavor?.storage &&
    model.result.flavor.storage.minimum.value !==
      model.result.flavor.storage.maximum.value;

  const onSubmit = model.form.handleSubmit(
    (data) => {
      // data has been validated, create payload and submit post request
      const serviceInfos: ServiceCreationWithEngine = {
        description: data.name,
        engine: data.engine as database.EngineEnum,
        nodesPattern: {
          flavor: data.flavor,
          number: data.nbNodes,
          region: data.region,
        },
        plan: data.plan,
        version: data.version,
        ipRestrictions: data.ipRestrictions.map((r) => ({
          ip: r.ip ?? '',
          description: r.description ?? '',
        })),
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
        } as database.service.Disk;
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

  const classNameLabel = 'scroll-m-20 text-xl font-semibold text-lg';

  const [isApiTerraformDialogOpen, setApiTerraformDialogOpen] = useState(false);

  return (
    <>
      <DiscoveryBanner>{t('discoveryModeActivate')}</DiscoveryBanner>
      <Form {...model.form}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div
            data-testid="order-funnel-container"
            className="col-span-1 md:col-span-3 flex flex-col gap-4"
          >
            <OrderSection
              id="engine"
              title={t('orderSectionTitleService')}
              description={t('orderSectionDescriptionService')}
            >
              <div className="flex flex-col gap-4">
                <FormField
                  control={model.form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={classNameLabel}>
                        {t('fieldNameLabel')}
                      </FormLabel>
                      <FormControl>
                        <NameInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={model.form.control}
                  name="engine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={classNameLabel}>
                        {t('fieldEngineLabel')}
                      </FormLabel>
                      <FormControl>
                        <EnginesSelect
                          engines={model.lists.engines}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={model.form.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={classNameLabel}>
                        {t('fieldVersionLabel')}
                      </FormLabel>
                      <FormControl>
                        <VersionSelect
                          versions={model.lists.versions}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </OrderSection>

            <OrderSection title={t('orderSectionTitleRegion')} id="region">
              <FormField
                control={model.form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RegionsSelect {...field} regions={model.lists.regions} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </OrderSection>

            <OrderSection title={t('orderSectionTitlePlan')} id="plan">
              <FormField
                control={model.form.control}
                name="plan"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PlansSelect {...field} plans={model.lists.plans} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </OrderSection>

            <OrderSection title={t('orderSectionTitleFlavor')} id="flavor">
              <FormField
                control={model.form.control}
                name="flavor"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FlavorsSelect {...field} flavors={model.lists.flavors} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={model.form.control}
                name="nbNodes"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormControl>
                      <NodesConfig
                        minimum={
                          model.result.availability?.specifications.nodes
                            .minimum
                        }
                        maximum={
                          model.result.availability?.specifications.nodes
                            .maximum
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </OrderSection>

            {hasStorageSelection && (
              <OrderSection id="storage" title={t('orderSectionTitleStorage')}>
                <FormField
                  control={model.form.control}
                  name="additionalStorage"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <StorageConfig
                          availability={model.result.availability}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </OrderSection>
            )}

            <OrderSection id="options" title={t('orderSectionTitleOptions')}>
              <div className="flex flex-col gap-4">
                {model.result.plan && (
                  <FormField
                    control={model.form.control}
                    name="network"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={classNameLabel}>
                          {t('fieldNetworkLabel')}
                        </FormLabel>
                        <FormControl>
                          <NetworkOptions
                            {...field}
                            value={field.value}
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
                      <FormLabel className={classNameLabel}>
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
              </div>
            </OrderSection>
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
              <Separator className="my-2" />
              {model.result.availability && (
                <OrderPrice
                  availability={model.result.availability}
                  prices={model.result.price}
                />
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2 justify-between">
              <Button
                data-testid="order-submit-button"
                className="w-full"
                disabled={isPendingAddService || isProjectDiscoveryMode}
                onClick={onSubmit}
              >
                {t('orderButton')}
              </Button>
              <Button
                type="button"
                className="w-full break-words whitespace-normal"
                mode="ghost"
                onClick={() => setApiTerraformDialogOpen(true)}
              >
                {t('apiAndTerraformButton')}
              </Button>
              {isApiTerraformDialogOpen && (
                <ApiTerraformDialog
                  onRequestClose={() => setApiTerraformDialogOpen(false)}
                  dialogData={model.result}
                ></ApiTerraformDialog>
              )}
            </CardFooter>
          </Card>
        </div>
      </Form>
    </>
  );
};

export default OrderFunnel;
