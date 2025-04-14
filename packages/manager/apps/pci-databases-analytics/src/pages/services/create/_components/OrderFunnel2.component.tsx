import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle, ArrowRight, Database } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  useToast,
  Alert,
  AlertDescription,
  RadioGroup,
  RadioTile,
  Badge,
  Separator,
  CardDescription,
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
import PriceUnitSwitch from '@/components/price-unit-switch/PriceUnitSwitch.component';
import FlavorsSelect from '@/components/order/flavor/FlavorSelect.component';
import NetworkOptions from '@/components/order/cluster-options/NetworkOptions.components';
import IpsRestrictionsForm from '@/components/order/cluster-options/IpsRestrictionsForm.component';
import RegionsSelect from '@/components/order/region/RegionSelect.component';
import OrderPrice from '@/components/order/price/OrderPrice.component';
import OrderSummary from './OrderSummary.component';
import ErrorList from '@/components/order/error-list/ErrorList.component';
import { FullCapabilities } from '@/hooks/api/database/capabilities/useGetFullCapabilities.hook';
import usePciProject from '@/hooks/api/project/usePciProject.hook';
import OvhLink from '@/components/links/OvhLink.component';
import { PlanCode } from '@/types/cloud/Project';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { humanizeEngine } from '@/lib/engineNameHelper';
import { EngineIcon } from '@/components/engine-icon/EngineIcon.component';
import { getTagVariant } from '@/lib/tagsHelper';

interface OrderFunnelProps {
  availabilities: database.Availability[];
  capabilities: FullCapabilities;
  suggestions: database.availability.Suggestion[];
  catalog: order.publicOrder.Catalog;
}

const OrderFunnel2 = ({
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

  // const onSubmit = model.form.handleSubmit(
  //   (data) => {
  //     // data has been validated, create payload and submit post request
  //     const serviceInfos: ServiceCreationWithEngine = {
  //       description: data.name,
  //       engine: data.engineWithVersion.engine as database.EngineEnum,
  //       nodesPattern: {
  //         flavor: data.flavor,
  //         number: data.nbNodes,
  //         region: data.region,
  //       },
  //       plan: data.plan,
  //       version: data.engineWithVersion.version,
  //       ipRestrictions: data.ipRestrictions,
  //     };
  //     if (data.network.type === database.NetworkTypeEnum.private) {
  //       // endpoint does not expect the network id, but the linked openstackId instead
  //       const networkOpenstackId = model.result.network.network.regions.find(
  //         (r) => r.region.includes(data.region),
  //       ).openstackId;
  //       serviceInfos.networkId = networkOpenstackId;
  //       serviceInfos.subnetId = data.network.subnetId;
  //     }
  //     if (model.result.flavor.storage) {
  //       serviceInfos.disk = {
  //         size:
  //           model.result.flavor.storage.minimum.value + data.additionalStorage,
  //       } as database.service.Disk;
  //     }
  //     addService(serviceInfos);
  //   },
  //   (error) => {
  //     toast({
  //       title: t('errorFormTitle'),
  //       variant: 'destructive',
  //       description: <ErrorList error={error} />,
  //     });
  //   },
  // );

  const scrollToDiv = (target: string) => {
    const div = document.getElementById(target);
    if (div) {
      div.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
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
              <Button type="button" asChild>
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-3 flex flex-col gap-4">
          <Card id="region" className="shadow">
            <CardHeader>
              <CardTitle>Availability and durability</CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Laboriosam cumque nemo debitis cupiditate libero incidunt?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                className="flex flex-col md:grid grid-cols-3 justify-stretch gap-2"
                defaultValue="3az"
              >
                <RadioTile value="1az" className="flex flex-col">
                  <div className="flex gap-2">
                    <h5>1-AZ Region</h5>
                    <Badge className="bg-primary-400 text-white">1-AZ</Badge>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex flex-col h-full justify-between items-start gap-2">
                    <p className="text-sm">
                      Resilient and low cost deployment in 1 availability zone.
                    </p>
                    <div className="border border-neutral-300 p-2 hidden lg:block">
                      <div className="border border-dashed border-primary relative p-5">
                        <span className="absolute top-1 left-1 bg-primary-400 px-1 text-xs text-white font-semibold">
                          AZ1
                        </span>
                        <Database className="text-primary-400" size={32} />
                      </div>
                    </div>
                  </div>
                </RadioTile>
                <RadioTile value="3az" className="flex flex-col">
                  <div className="flex gap-2">
                    <h5>3-AZ Region</h5>
                    <Badge className="bg-primary-500 text-white">3-AZ</Badge>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex flex-col h-full justify-between items-start gap-2">
                    <p className="text-sm">
                      High resilience/high availability deployment for your
                      critical applications across 3 availability zones.
                    </p>
                    <div className="border border-neutral-300 p-2 gap-1 hidden lg:flex flex-wrap">
                      <div className="border border-dashed border-primary relative p-5">
                        <span className="absolute top-1 left-1 bg-primary px-1 text-xs text-white font-semibold">
                          AZ1
                        </span>
                        <Database className="text-primary-400" size={32} />
                      </div>
                      <div className="border border-dashed border-primary relative p-5">
                        <span className="absolute top-1 left-1 bg-primary px-1 text-xs text-white font-semibold">
                          AZ2
                        </span>
                        <Database className="text-primary-400" size={32} />
                      </div>
                      <div className="border border-dashed border-primary relative p-5">
                        <span className="absolute top-1 left-1 bg-primary px-1 text-xs text-white font-semibold">
                          AZ3
                        </span>
                        <Database className="text-primary-400" size={32} />
                      </div>
                    </div>
                  </div>
                </RadioTile>
                <RadioTile
                  disabled
                  value="localzone"
                  className="flex flex-col"
                >
                  <div className="flex gap-2">
                    <h5>Local Zone</h5>
                    <Badge className="bg-primary-200 text-text">
                      Local Zone
                    </Badge>
                  </div>
                  <Separator className="my-2" />
                  <p className="text-sm">
                    Deploy your applications as geographically close to your
                    ysers as possible, for low latency and compliant data
                    residency.
                  </p>
                </RadioTile>
              </RadioGroup>
            </CardContent>
          </Card>
          <Card className="shadow">
            <CardHeader>
              <CardTitle>Region</CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro
                odit eum tempora.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegionsSelect
                value={model.form.getValues('region')}
                onChange={(newRegion) => {
                  model.form.setValue('region', newRegion);
                }}
                regions={model.lists.regions}
              />
            </CardContent>
          </Card>
          <Card id="engine" className="shadow">
            <CardHeader>
              <CardTitle>Engine</CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Id
                quasi earum aliquam, inventore alias cumque quo!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2"
                value={model.form.getValues('engineWithVersion.engine')}
                onValueChange={(newEngine) => {
                  model.form.setValue('engineWithVersion.engine', newEngine);
                  model.form.setValue('engineWithVersion.version', model.lists.engines.find((e) => e.name === newEngine)?.defaultVersion);
                }}
              >
                {model.lists.engines?.map((engine) => (
                  <RadioTile
                    value={engine.name}
                    className="flex flex-col"
                    key={engine.name}
                  >
                    <div className="flex justify-between items-center w-full">
                      <div className="flex gap-2">
                        <h5 className={'capitalize'}>
                          {humanizeEngine(engine.name as database.EngineEnum)}
                        </h5>
                        <div className="flex gap-1 items-center">
                          {engine.tags.map((tag) => (
                            <Badge
                              variant={getTagVariant(tag)}
                              data-testid={`Badge${tag}`}
                              key={tag}
                              className="text-xs h-4"
                            >
                              {t(`versionTag-${tag}`, tag)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <EngineIcon
                        engine={engine.name as database.EngineEnum}
                        category={engine.category}
                      />
                    </div>
                    <Separator className="my-2" />
                    <p className="text-sm">
                      {t(`description-${engine.name}`, engine.description)}
                    </p>
                  </RadioTile>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
          <Card className="shadow">
            <CardHeader>
              <CardTitle className="mt-2">Version</CardTitle>
              <CardDescription>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero
                asperiores cumque ea facilis dolorum, consectetur recusandae
                quas vero! Temporibus laudantium veniam exercitationem vitae
                ratione nemo fugit magnam, odit doloremque quos!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={model.form.getValues('engineWithVersion.version')}
                onValueChange={(newVersion) => {
                  model.form.setValue('engineWithVersion.version', newVersion);
                }}
                className="flex"
              >
                {model.result.engine?.versions.map((version) => (
                  <RadioTile
                    value={version.name}
                    className="flex flex-col h-auto py-2 px-4"
                  >
                        <div className="flex gap-1 items-center">
                    <h5>{version.name}</h5>
                    <div className="flex gap-1 items-center">
                          {version.tags.map((tag) => (
                            <Badge
                              variant={getTagVariant(tag)}
                              data-testid={`Badge${tag}`}
                              key={tag}
                              className="text-xs h-4"
                            >
                              {t(`versionTag-${tag}`, tag)}
                            </Badge>
                          ))}
                        </div>
                        </div>
                  </RadioTile>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
          <Card id="plan" className="shadow">
            <CardHeader>
              <CardTitle className="mt-2">Plan</CardTitle>
              <CardDescription>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={model.form.getValues('plan')}
                onValueChange={(newPlan) => {
                  model.form.setValue('plan', newPlan);
                }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2"
              >
                {model.lists.plans.map((plan) => (
                  <RadioTile value={plan.name} className="text-left">
                    <h5 className="capitalize">{plan.name}</h5>
                    <Separator className="my-2" />
                    <p className="text-sm">
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Cupiditate esse non consectetur modi tenetur.
                    </p>
                  </RadioTile>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
          <Card id="flavor" className="shadow">
            <CardHeader>
              <CardTitle className="mt-2">Instance</CardTitle>
              <CardDescription>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis earum placeat ratione quibusdam.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                defaultValue={'general-purpose'}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 mb-4"
              >
                {[
                  'general-purpose',
                  'discovery',
                  'compute-optimized',
                  'memory-optimized',
                ].map((type) => (
                  <RadioTile
                    value={type}
                    className="text-left"
                    disabled={type !== 'general-purpose'}
                  >
                    <h5 className="capitalize">{type.replace('-', ' ')}</h5>
                    <Separator className="my-2" />
                    <p className="text-sm">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Sapiente, animi blanditiis?
                    </p>
                  </RadioTile>
                ))}
              </RadioGroup>
              <FlavorsSelect
                value={model.form.getValues('flavor')}
                onChange={(newFlavor) => {
                  model.form.setValue('flavor', newFlavor);
                }}
                flavors={model.lists.flavors}
              />
            </CardContent>
          </Card>

          {model.result.availability &&
            (hasNodeSelection || hasStorageSelection) && (
              <Card id="cluster" className="shadow">
                <CardHeader>
                  <CardTitle className="mt-2">
                    {t('sectionClusterTitle')}
                  </CardTitle>
                  <CardDescription>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sint, itaque tempore sit sapiente quam quas!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {hasNodeSelection && (
                    // add label
                    <>
                      {t('fieldNodesLabel')}
                      <NodesConfig
                        minimum={model.result.plan.nodes.minimum}
                        maximum={model.result.plan.nodes.maximum}
                        value={model.form.getValues('nbNodes')}
                        onChange={(newNbNodes) =>
                          model.form.setValue('nbNodes', newNbNodes)
                        }
                      />
                    </>
                  )}
                  {hasStorageSelection && (
                    <>
                      {t('fieldStorageLabel')}
                      <StorageConfig
                        availability={model.result.availability}
                        value={model.form.getValues('additionalStorage')}
                        onChange={(newStorage) =>
                          model.form.setValue('additionalStorage', newStorage)
                        }
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            )}

          <Card id="options" className="shadow">
            <CardHeader>
              <CardTitle className="mt-2">{t('sectionOptionsTitle')}</CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint,
                itaque tempore sit sapiente quam quas!
              </CardDescription>
            </CardHeader>
            <CardContent>
              {model.result.plan && (
                <>
                  {t('fieldNetworkLabel')}
                  <NetworkOptions
                    value={model.form.getValues('network')}
                    onChange={(newNetwork) =>
                      model.form.setValue('network', newNetwork)
                    }
                    networks={model.lists.networks}
                    subnets={model.lists.subnets}
                    networkQuery={model.queries.networks}
                    subnetQuery={model.queries.subnets}
                    availableNetworks={model.result.plan.networks}
                  />
                </>
              )}
              {t('fieldIpsLabel')}
              <IpsRestrictionsForm
                value={model.form.getValues('ipRestrictions')}
                onChange={(newIps) =>
                  model.form.setValue('ipRestrictions', newIps)
                }
              />
            </CardContent>
          </Card>
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
      </div>
    </>
  );
};

export default OrderFunnel2;
