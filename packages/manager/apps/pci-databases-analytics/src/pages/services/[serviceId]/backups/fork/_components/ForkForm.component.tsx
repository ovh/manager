import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
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
} from '@/hooks/api/database/service/useAddService.hook';
import PriceUnitSwitch from '@/components/price-unit-switch/PriceUnitSwitch.component';
import PlansSelect from '@/components/order/plan/PlanSelect.component';
import FlavorsSelect from '@/components/order/flavor/FlavorSelect.component';
import NetworkOptions from '@/components/order/cluster-options/NetworkOptions.components';
import IpsRestrictionsForm from '@/components/order/cluster-options/IpsRestrictionsForm.component';
import RegionsSelect from '@/components/order/region/RegionSelect.component';
import OrderPrice from '@/components/order/price/OrderPrice.component';
import ForkSummary from './ForkSummary.component';
import { useFork } from './useFork.hook';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import { formatStorage } from '@/lib/bytesHelper';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useServiceData } from '../../../Service.context';
import ErrorList from '@/components/order/error-list/ErrorList.component';
import { ForkSourceType } from '@/types/orderFunnel';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TimePicker } from '@/components/ui/time-picker';
import { useDateFnsLocale } from '@/hooks/useDateFnsLocale.hook';
import { ForkInitialValue } from '../Fork.page';
import { FullCapabilities } from '@/hooks/api/database/capabilities/useGetFullCapabilities.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';

interface ForkFormProps {
  availabilities: database.Availability[];
  capabilities: FullCapabilities;
  initialValue: ForkInitialValue;
  catalog: order.publicOrder.Catalog;
  backups: database.Backup[];
}

const ForkForm = ({
  availabilities,
  capabilities,
  initialValue,
  catalog,
  backups,
}: ForkFormProps) => {
  const model = useFork(
    availabilities,
    capabilities,
    initialValue,
    catalog,
    backups,
  );
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
        description: getCdbApiErrorMessage(err),
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
        forkFrom: {
          serviceId: data.forkFrom.serviceId,
        },
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
      switch (data.forkFrom.type) {
        case ForkSourceType.now:
          serviceInfos.forkFrom.pointInTime = new Date().toISOString();
          break;
        case ForkSourceType.pit:
          serviceInfos.forkFrom.pointInTime = data.forkFrom.pointInTime.toISOString();
          break;
        case ForkSourceType.backup:
          serviceInfos.forkFrom.backupId = data.forkFrom.backupId;
          break;
        default:
          break;
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
        <div
          data-testid="fork-form-container"
          className="col-span-1 md:col-span-3 divide-y-[1rem] divide-transparent"
        >
          <section id="source" className="divide-y-[1rem] divide-transparent">
            <FormField
              control={model.form.control}
              name="forkFrom.type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={classNameLabel}>
                    {t('inputSourceTypeLabel')}
                  </FormLabel>
                  <FormDescription>
                    {t('inputSourceTypeDescription')}
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-3 gap-2"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            data-testid="radio-button-now"
                            value={ForkSourceType.now}
                            disabled={!model.result.canUsePit}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t('inputTypeValueNow')}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            data-testid="radio-button-pitr"
                            value={ForkSourceType.pit}
                            disabled={!model.result.canUsePit}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t('inputTypeValuePIT')}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            data-testid="radio-button-backup"
                            value={ForkSourceType.backup}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t('inputTypeValueBackup')}
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {model.result.source.type === ForkSourceType.backup && (
              <FormField
                control={model.form.control}
                name="forkFrom.backupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(classNameLabel, 'text-lg')}>
                      {t('inputSourceBackupLabel')}
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger ref={field.ref}>
                          <SelectValue
                            placeholder={t('inputSourceBackupPlaceholder')}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {backups.map((backup) => (
                              <SelectItem key={backup.id} value={backup.id}>
                                <FormattedDate
                                  date={new Date(backup.createdAt)}
                                  options={{
                                    dateStyle: 'medium',
                                    timeStyle: 'medium',
                                  }}
                                />{' '}
                                ({formatStorage(backup.size)})
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {model.result.source.type === ForkSourceType.pit && (
              <FormField
                control={model.form.control}
                name="forkFrom.pointInTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      data-testid="pitr-form-label"
                      className={cn(classNameLabel, 'text-lg')}
                    >
                      {t('inputSourcePITPlaceholder')}
                    </FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            ref={field.ref}
                            variant={'ghost'}
                            className={cn(
                              'text-left justify-start flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              <FormattedDate
                                date={field.value}
                                options={{
                                  dateStyle: 'medium',
                                  timeStyle: 'medium',
                                }}
                              />
                            ) : (
                              <span>{t('inputSourcePITPlaceholder')}</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            locale={dateLocale}
                            disabled={(date) =>
                              date > new Date() ||
                              date < model.result.minPitrDate
                            }
                            initialFocus
                          />
                          <div className="p-3 border-t border-border">
                            <TimePicker
                              setDate={field.onChange}
                              date={field.value}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
          <section id="options" className="divide-y-[1rem] divide-transparent">
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
            <ForkSummary
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
              data-testid="fork-submit-button"
              className="w-full"
              disabled={isPendingAddService}
            >
              {t('orderButton')}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default ForkForm;
