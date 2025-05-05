import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle,
  ArrowRight,
  Cpu,
  Database,
  Eye,
  Globe,
  MemoryStick,
  Wrench,
} from 'lucide-react';
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
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  Code,
  json,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Switch,
} from '@datatr-ux/uxlib';
import { order } from '@/types/catalog';
import * as database from '@/types/cloud/project/database';
import StorageConfig from '@/components/order/cluster-configuration/StorageConfig.component';
import NodesConfig from '@/components/order/cluster-configuration/NodesConfig.component';
import { useAddService } from '@/hooks/api/database/service/useAddService.hook';
import PriceUnitSwitch from '@/components/price-unit-switch/PriceUnitSwitch.component';
import NetworkOptions from '@/components/order/cluster-options/NetworkOptions.components';
import IpsRestrictionsForm from '@/components/order/cluster-options/IpsRestrictionsForm.component';
import OrderPrice from '@/components/order/price/OrderPrice.component';
import OrderSummary from './OrderSummary.component';
import { FullCapabilities } from '@/hooks/api/database/capabilities/useGetFullCapabilities.hook';
import usePciProject from '@/hooks/api/project/usePciProject.hook';
import OvhLink from '@/components/links/OvhLink.component';
import { PlanCode } from '@/types/cloud/Project';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { humanizeEngine } from '@/lib/engineNameHelper';
import { EngineIcon } from '@/components/engine-icon/EngineIcon.component';
import { getTagVariant } from '@/lib/tagsHelper';
import { cn } from '@/lib/utils';
import FlavorsSelect2 from '@/components/order/flavor/FlavorSelect2.component';
import RegionsSelect2 from '@/components/order/region/RegionSelect2.component';
import { useOrderFunnel2 } from './useOrderFunnel2.hook';
import OrderPrice2 from '@/components/order/price/OrderPrice2.component';
import OrderSummary2 from './OrderSummary2.component';
import IpsRestrictionsForm2 from '@/components/order/cluster-options/IpsRestrictionsForm.component2';
import StorageConfig2 from '@/components/order/cluster-configuration/StorageConfig.component2';
import NetworkOptions2 from '@/components/order/cluster-options/NetworkOptions.component2';
import OrderSection from './OrderSection.component';

// export interface LocationRegion {
//   /** List of availability zones for the region */
//   availabilityZones: string[];

//   /** Cardinal direction where the region is located */
//   cardinalPoint:
//     | 'CENTRAL'
//     | 'EAST'
//     | 'NORTH'
//     | 'NORTHEAST'
//     | 'NORTHWEST'
//     | 'SOUTH'
//     | 'SOUTHEAST'
//     | 'SOUTHWEST'
//     | 'WEST';

//   /** ISO code of the city */
//   cityCode: string;

//   /** Geographical latitude of the city */
//   cityLatitude: number;

//   /** Geographical longitude of the city */
//   cityLongitude: number;

//   /** Full name of the city */
//   cityName: string;

//   /** Region's short code */
//   code: string;

//   /** ISO code of the country */
//   countryCode: string;

//   /** Full name of the country */
//   countryName: string;

//   /** Short code representing the geographical area */
//   geographyCode: string;

//   /** Name of the geographical area */
//   geographyName: string;

//   /** Location of the region */
//   location: string;

//   /** Name of the region */
//   name: string;

//   /** Year the region was opened */
//   openingYear: number;

//   /** Specific typology of the region */
//   specificType: 'BACKUP' | 'LZ' | 'SNC' | 'STANDARD';

//   /** General typology of the region */
//   type: 'LOCAL-ZONE' | 'REGION-1-AZ' | 'REGION-3-AZ';
// }

export interface LocationRegion {
  name: string;
  type: 'localzone' | 'region' | 'region-3-az';
  status: string;
  services: {
    name: string;
    status: string;
    endpoint: string;
  }[];
  countryCode: string;
  ipCountries: string[];
  continentCode: string;
  availabilityZones: string[];
  datacenterLocation: string;
}

interface OrderFunnelProps {
  availabilities: database.Availability[];
  capabilities: FullCapabilities;
  suggestions: database.availability.Suggestion[];
  catalog: order.publicOrder.Catalog;
  regions: LocationRegion[];
}

const OrderFunnel2 = ({
  availabilities,
  capabilities,
  suggestions,
  catalog,
  regions,
}: OrderFunnelProps) => {
  const model = useOrderFunnel2(
    availabilities,
    capabilities,
    suggestions,
    catalog,
    regions,
  );
  const projectData = usePciProject();
  const [tileMode, setTileMode] = useState(true);
  const [mode, setMode] = useState('advanced');
  const [showMonthlyPrice, setShowMonthlyPrice] = useState(false);
  const [regionType, setRegionType] = useState('REGION-1-AZ');
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

  const isAdvanced = mode === 'advanced';

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
          <OrderSection
            cardMode={tileMode}
            id="mode"
            title="Mode"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur commodi debitis reiciendis praesentium eum eaque?"
          >
            <RadioGroup
              className="flex flex-col md:grid grid-cols-2 justify-stretch gap-2"
              defaultValue={'advanced'}
              value={mode}
              onValueChange={setMode}
            >
              <RadioTile value="simple" className="flex flex-col">
                <div className="flex gap-2">
                  <h5>Simple</h5>
                </div>
                <Separator className="my-2" />
                <div className="flex flex-col h-full justify-between items-start gap-2">
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </p>
                </div>
              </RadioTile>
              <RadioTile value="advanced" className="flex flex-col">
                <div className="flex gap-2 items-center">
                  <h5>Advanced</h5>
                  <Wrench className="size-4" />
                </div>
                <Separator className="my-2" />
                <div className="flex flex-col h-full justify-between items-start gap-2">
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut
                    quas quis illum nulla dolor?
                  </p>
                </div>
              </RadioTile>
            </RadioGroup>
          </OrderSection>

          <OrderSection
            cardMode={tileMode}
            id="region"
            title="Region"
            description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laboriosam cumque nemo debitis cupiditate libero incidunt?"
            className={cn('hidden', isAdvanced && 'block')}
          >
            <div>
              <RadioGroup
                className="flex flex-col md:grid grid-cols-3 justify-stretch gap-2 mb-4"
                value={regionType}
                onValueChange={setRegionType}
              >
                <RadioTile value="REGION-1-AZ" className="flex flex-col">
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
                        <Database className="text-primary-400 size-8" />
                      </div>
                    </div>
                  </div>
                </RadioTile>
                <RadioTile value="REGION-3-AZ" className="flex flex-col">
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
                <RadioTile value="LOCAL-ZONE" className="flex flex-col">
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
              <RegionsSelect2
                value={model.form.getValues('region')}
                onChange={(newRegion) => {
                  console.log(newRegion);
                  model.form.setValue('region', newRegion);
                }}
                regions={model.lists.regions.filter((r) =>
                  [regionType, '?'].includes(r.type),
                )}
              />
            </div>
          </OrderSection>

          <OrderSection
            cardMode={tileMode}
            id="engine"
            title="Engine"
            description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro odit eum tempora."
          >
            <RadioGroup
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2"
              value={model.form.getValues('engineWithVersion.engine')}
              onValueChange={(newEngine) => {
                model.form.setValue('engineWithVersion', {
                  engine: newEngine,
                  version: model.lists.engines.find((e) => e.name === newEngine)
                    ?.defaultVersion,
                });
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
          </OrderSection>

          <OrderSection
            cardMode={tileMode}
            title="Version"
            description="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero
                asperiores cumque ea facilis dolorum, consectetur recusandae
                quas vero! Temporibus laudantium veniam exercitationem vitae
                ratione nemo fugit magnam, odit doloremque quos!"
          >
            <RadioGroup
              value={model.form.getValues('engineWithVersion.version')}
              onValueChange={(newVersion) => {
                model.form.setValue('engineWithVersion', {
                  engine: model.form.getValues('engineWithVersion.engine'),
                  version: newVersion,
                });
              }}
              className="flex"
            >
              {model.result.engine?.versions.map((version) => (
                <RadioTile
                  key={version.name}
                  value={version.name}
                  className="flex flex-col h-auto py-2 px-4 relative"
                >
                  <div className="flex gap-1 items-center">
                    <h5>{version.name}</h5>
                    <div className="flex gap-1 items-center absolute right-0 -top-3">
                      {version.tags.map((tag) => (
                        <HoverCard key={tag}>
                          <HoverCardTrigger>
                            <Badge
                              variant={getTagVariant(tag)}
                              data-testid={`Badge${tag}`}
                              className="size-3 p-0 text-center"
                            >
                              <span className="size-3 flex justify-center items-center">
                                !
                              </span>
                            </Badge>
                          </HoverCardTrigger>
                          <HoverCardContent side="top">
                            {t(`versionTag-${tag}`, tag)}
                          </HoverCardContent>
                        </HoverCard>
                      ))}
                    </div>
                  </div>
                </RadioTile>
              ))}
            </RadioGroup>
          </OrderSection>

          <OrderSection
            cardMode={tileMode}
            id="plan"
            className={cn('hidden', isAdvanced && 'block')}
            title="Plan"
            description="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
          >
            <RadioGroup
              value={model.form.getValues('plan')}
              onValueChange={(newPlan) => {
                model.form.setValue('plan', newPlan);
              }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2"
            >
              {model.lists.plans.map((plan) => (
                <RadioTile
                  value={plan.name}
                  className="text-left"
                  key={plan.name}
                >
                  <h5 className="capitalize">{plan.name}</h5>
                  <Separator className="my-2" />
                  <p className="text-sm">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Cupiditate esse non consectetur modi tenetur.
                  </p>
                </RadioTile>
              ))}
            </RadioGroup>
          </OrderSection>

          <OrderSection
            cardMode={tileMode}
            id="flavor"
            title="Instance"
            description="Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis earum placeat ratione quibusdam."
          >
            <div>
              <RadioGroup
                defaultValue={'general-purpose'}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 mb-4"
              >
                <RadioTile value={'general-purpose'} className="text-left">
                  <h5 className="flex gap-2 items-center">
                    <Globe className="size-4" /> General Purpose
                  </h5>
                  <Separator className="my-2" />
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sapiente, animi blanditiis?
                  </p>
                </RadioTile>
                <RadioTile value={'discovery'} className="text-left" disabled>
                  <h5 className="flex gap-2 items-center">
                    <Eye className="size-4" /> Discorvery
                  </h5>
                  <Separator className="my-2" />
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sapiente, animi blanditiis?
                  </p>
                </RadioTile>
                <RadioTile
                  value={'compute-optimized'}
                  className="text-left"
                  disabled
                >
                  <h5 className="flex gap-2 items-center">
                    <Cpu className="size-4" /> Compute Optimized
                  </h5>
                  <Separator className="my-2" />
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sapiente, animi blanditiis?
                  </p>
                </RadioTile>
                <RadioTile
                  value={'memory-optimized'}
                  className="text-left"
                  disabled
                >
                  <h5 className="flex gap-2 items-center">
                    <MemoryStick className="size-4" /> Memory Optimized
                  </h5>
                  <Separator className="my-2" />
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sapiente, animi blanditiis?
                  </p>
                </RadioTile>
              </RadioGroup>
              <FlavorsSelect2
                value={model.form.getValues('flavor')}
                onChange={(newFlavor) => {
                  model.form.setValue('flavor', newFlavor);
                }}
                flavors={model.lists.flavors}
              />
              <h6 className="mt-2">{t('fieldNodesLabel')}</h6>
              <NodesConfig
                minimum={
                  model.result.availability?.specifications.nodes.minimum
                }
                maximum={
                  model.result.availability?.specifications.nodes.maximum
                }
                value={model.form.getValues('nbNodes')}
                onChange={(newNbNodes) =>
                  model.form.setValue('nbNodes', newNbNodes)
                }
              />
            </div>
          </OrderSection>

          {model.result.availability && hasStorageSelection && (
            <OrderSection
              cardMode={tileMode}
              id="storage"
              className={cn('hidden', isAdvanced && 'block')}
              title="Stockage"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint,
                  itaque tempore sit sapiente quam quas!"
            >
              <div className="flex flex-col gap-2">
                <StorageConfig2
                  storageMode={model.result.engine.storageMode}
                  availability={model.result.availability}
                  value={model.form.getValues('additionalStorage')}
                  onChange={(newStorage) =>
                    model.form.setValue('additionalStorage', newStorage)
                  }
                />
              </div>
            </OrderSection>
          )}

          <OrderSection
            cardMode={tileMode}
            id="options"
            className={cn('hidden', isAdvanced && 'block')}
            title={t('sectionOptionsTitle')}
            description="
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint,
                itaque tempore sit sapiente quam quas!"
          >
            <div className="flex flex-col gap-2">
              {model.result.plan && (
                <>
                  <h6>{t('fieldNetworkLabel')}</h6>
                  <Card>
                    <CardContent className="py-2">
                      <NetworkOptions2
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
                    </CardContent>
                  </Card>
                </>
              )}
              <h6>{t('fieldIpsLabel')}</h6>

              <Card>
                <CardContent className="py-2">
                  <IpsRestrictionsForm2
                    value={model.form.getValues('ipRestrictions')}
                    onChange={(newIps) =>
                      model.form.setValue('ipRestrictions', newIps)
                    }
                  />
                </CardContent>
              </Card>
            </div>
          </OrderSection>

          <Card
            id="debug"
            className={cn('shadow-sm hidden', isAdvanced && 'block')}
          >
            <CardHeader>
              <CardTitle>DEBUG</CardTitle>
              <CardDescription>Lorem ipsum dolor sit amet.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="tileMode"
                  checked={tileMode}
                  onCheckedChange={setTileMode}
                />
                <Label htmlFor="tileMode">Use Cards</Label>
              </div>
              <Accordion type="single" collapsible>
                <AccordionItem value="availability">
                  <AccordionTrigger className="text-sm">
                    Availability
                  </AccordionTrigger>
                  <AccordionContent>
                    {model.result.availability && (
                      <Code
                        className="text-xs"
                        code={JSON.stringify(
                          model.result.availability,
                          null,
                          2,
                        )}
                        lang={json}
                      />
                    )}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="engine">
                  <AccordionTrigger className="text-sm">
                    Engine
                  </AccordionTrigger>
                  <AccordionContent>
                    {model.result.engine && (
                      <Code
                        className="text-xs"
                        code={JSON.stringify(
                          {
                            ...model.result.engine,
                            versions: model.result.engine.versions.length,
                          },
                          null,
                          2,
                        )}
                        lang={json}
                      />
                    )}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="flavor">
                  <AccordionTrigger className="text-sm">
                    Flavor
                  </AccordionTrigger>
                  <AccordionContent>
                    {model.result.flavor && (
                      <Code
                        className="text-xs"
                        code={JSON.stringify(model.result.flavor, null, 2)}
                        lang={json}
                      />
                    )}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="region">
                  <AccordionTrigger className="text-sm">
                    Region
                  </AccordionTrigger>
                  <AccordionContent>
                    {model.result.region && (
                      <Code
                        className="text-xs"
                        code={JSON.stringify(
                          {
                            ...model.result.region,
                            flavors: model.result.region.flavors.length,
                          },
                          null,
                          2,
                        )}
                        lang={json}
                      />
                    )}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="plan">
                  <AccordionTrigger className="text-sm">Plan</AccordionTrigger>
                  <AccordionContent>
                    {model.result.plan && (
                      <Code
                        className="text-xs"
                        code={JSON.stringify(
                          {
                            ...model.result.plan,
                            regions: model.result.plan.regions.length,
                          },
                          null,
                          2,
                        )}
                        lang={json}
                      />
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <Card className="sticky top-4 h-fit shadow-sm">
          <CardHeader>
            <CardTitle>{t('summaryTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2">
            <OrderSummary2
              order={model.result}
              onSectionClicked={(section) => scrollToDiv(section)}
            />
            <Separator className="my-2" />
            <p className="font-bold">Pricing</p>
            <OrderPrice2
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
