import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon } from 'lucide-react';
import {
  Calendar,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  useToast,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  RadioGroup,
  RadioGroupItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  TimePicker,
  Separator,
} from '@datatr-ux/uxlib';
import { order } from '@/types/catalog';
import * as database from '@/types/cloud/project/database';
import StorageConfig from '@/components/order/cluster-configuration/StorageConfig.component';
import NodesConfig from '@/components/order/cluster-configuration/NodesConfig.component';
import { cn } from '@/lib/utils';
import {
  ServiceCreationWithEngine,
  useAddService,
} from '@/hooks/api/database/service/useAddService.hook';
import PlansSelect from '@/components/order/plan/PlanSelect.component';
import FlavorsSelect from '@/components/order/flavor/FlavorSelect.component';
import NetworkOptions from '@/components/order/cluster-options/NetworkOptions.components';
import IpsRestrictionsForm from '@/components/order/cluster-options/IpsRestrictionsForm.component';
import RegionsSelect from '@/components/order/region/RegionSelect.component';
import OrderPrice from '@/components/order/price/OrderPrice.component';
import { useFork } from './useFork.hook';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import { formatStorage } from '@/lib/bytesHelper';
import { useServiceData } from '../../../Service.context';
import ErrorList from '@/components/order/error-list/ErrorList.component';
import { ForkSourceType } from '@/types/orderFunnel';
import { useDateFnsLocale } from '@/hooks/useDateFnsLocale.hook';
import { ForkInitialValue } from '../Fork.page';
import { FullCapabilities } from '@/hooks/api/database/capabilities/useGetFullCapabilities.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import OrderSummary from '@/pages/services/create/_components/OrderSummary.component';
import OrderSection from '@/components/order/Section.component';
import NameInput from '@/components/order/name/NameInput.component';

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

  const hasStorageSelection =
    model.result.availability &&
    model.result.flavor?.storage &&
    model.result.flavor.storage.minimum.value !==
      model.result.flavor.storage.maximum.value;

  const onSubmit = model.form.handleSubmit(
    (data) => {
      // data has been validated, create payload and submit post request
      const serviceInfos: Omit<ServiceCreationWithEngine, 'disk'>& {
        disk?: Partial<database.service.Disk>;
      }  = {
        description: data.name,
        engine: data.engine as database.EngineEnum,
        nodesPattern: {
          flavor: data.flavor,
          number: data.nbNodes,
          region: data.region,
        },
        plan: data.plan,
        version: data.version,
        ipRestrictions: data.ipRestrictions as database.service.IpRestriction[],
        forkFrom: {
          serviceId: data.forkFrom.serviceId,
        } as database.service.creation.ForkFrom,
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
        const disk: Partial<database.service.Disk> = {
          size:
            model.result.flavor.storage.minimum.value + data.additionalStorage,
        }
        serviceInfos.disk = disk;
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

  const classNameLabel = 'scroll-m-20 text-xl font-semibold text-lg';

  return (
    <Form {...model.form}>
      <div
        className="grid grid-cols-1 lg:grid-cols-4 gap-4"
        onSubmit={onSubmit}
      >
        <div
          data-testid="fork-form-container"
          className="col-span-1 md:col-span-3 flex flex-col gap-4"
        >
          <OrderSection id="engine" title={t('orderSectionTitleService')}>
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
          </OrderSection>
          <OrderSection id="source" title={t('orderSectionTitleSource')}>
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
                      <FormItem className="flex items-end gap-2">
                        <FormControl>
                          <RadioGroupItem
                            data-testid="radio-button-now"
                            value={ForkSourceType.now}
                            disabled={!model.result.canUsePit}
                          />
                        </FormControl>
                        <FormLabel
                          className={cn(
                            'font-normal',
                            !model.result.canUsePit &&
                              'opacity-70 cursor-not-allowed',
                          )}
                        >
                          {t('inputTypeValueNow')}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-end gap-2">
                        <FormControl>
                          <RadioGroupItem
                            data-testid="radio-button-pitr"
                            value={ForkSourceType.pit}
                            disabled={!model.result.canUsePit}
                          />
                        </FormControl>
                        <FormLabel
                          className={cn(
                            'font-normal',
                            !model.result.canUsePit &&
                              'opacity-70 cursor-not-allowed',
                          )}
                        >
                          {t('inputTypeValuePIT')}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-end gap-2">
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
                  <FormItem className="mt-4">
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
                  <FormItem className="mt-4">
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            ref={field.ref}
                            mode={'ghost'}
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
          </OrderSection>

          <OrderSection title={t('fieldRegionLabel')} id="region">
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

          <OrderSection title={t('fieldPlanLabel')} id="plan">
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
                        model.result.availability?.specifications.nodes.minimum
                      }
                      maximum={
                        model.result.availability?.specifications.nodes.maximum
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
          <CardFooter className="flex justify-between">
            <Button
              onClick={onSubmit}
              data-testid="fork-submit-button"
              className="w-full"
              disabled={isPendingAddService}
            >
              {t('orderButton')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Form>
  );
};

export default ForkForm;
