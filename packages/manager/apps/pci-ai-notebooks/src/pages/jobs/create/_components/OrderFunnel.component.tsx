import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Plus,
  TerminalSquare,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import * as ai from '@/types/cloud/project/ai';
import { order } from '@/types/catalog';
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
import { Button } from '@/components/ui/button';
import RegionsSelect from '@/components/order/region/RegionSelect.component';
import FlavorsSelect from '@/components/order/flavor/FlavorSelect.component';
import { Input } from '@/components/ui/input';
import OrderPrice from '@/components/order/price/OrderPrice.component';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import SshKeyForm from '@/components/order/configuration/SshKeyForm.component';
import { SshKey } from '@/types/cloud/sshkey';
import VolumeForm from '@/components/order/volumes/VolumesForm.component';
import { useToast } from '@/components/ui/use-toast';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import ErrorList from '@/components/order/error-list/ErrorList.component';
import { JobSuggestions, PrivacyEnum } from '@/types/orderFunnel';
import { useModale } from '@/hooks/useModale';
import CliEquivalent from './CliEquivalent.component';
import { getJobSpec } from '@/lib/orderFunnelHelper';
import A from '@/components/links/A.component';
import { getHowToManageDataInAIDocLink } from '@/configuration/guide';
import { useLocale } from '@/hooks/useLocale';
import OvhLink from '@/components/links/OvhLink.component';
import { useOrderFunnel } from './useOrderFunnel.hook';
import { useGetCommand } from '@/hooks/api/ai/job/useGetCommand.hook';
import OrderSummary from './OrderSummary.component';
import { useAddJob } from '@/hooks/api/ai/job/useAddJob.hook';
import ImagesSelect from '@/components/order/docker-image/DockerImageSelect.component';
import DockerCommand from '@/components/order/docker-command/DockerCommand.component';

interface OrderJobsFunnelProps {
  regions: ai.capabilities.Region[];
  catalog: order.publicOrder.Catalog;
  presetImage: ai.job.PresetImage[];
  sshKeys: SshKey[];
  suggestions: JobSuggestions[];
}

const OrderFunnel = ({
  regions,
  catalog,
  presetImage,
  sshKeys,
  suggestions,
}: OrderJobsFunnelProps) => {
  const model = useOrderFunnel(regions, catalog, presetImage, suggestions);

  const { t } = useTranslation('pci-ai-training/jobs/create');
  const locale = useLocale();
  const { projectId } = useParams();
  const [showAdvancedConfiguration, setShowAdvancedConfiguration] = useState(
    false,
  );
  const accordionContentRef = useRef(null);
  const cliEquivalentModale = useModale('cli');
  const navigate = useNavigate();

  const { toast } = useToast();
  const [command, setCommand] = useState<ai.Command>({ command: '' });

  const { addJob, isPending: isPendingAddJob } = useAddJob({
    onError: (err) => {
      toast({
        title: t('errorCreatingJob'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
    },
    onSuccess: (job) => {
      toast({
        title: t('successCreatingJobTitle'),
        description: t('successCreatingJobDescription'),
      });
      navigate(`../${job.id}`);
    },
  });

  const { getCommand, isPending: isPendingCommand } = useGetCommand({
    onError: (err) => {
      toast({
        title: t('errorGetCommandCli'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
    },
    onSuccess: (cliCommand) => {
      setCommand(cliCommand);
    },
  });

  const getCliCommand = () => {
    const jobInfo: ai.job.JobSpecInput = getJobSpec(model.result);
    getCommand({ projectId, jobInfo });
  };

  const onSubmit = model.form.handleSubmit(
    () => {
      const jobInfos: ai.job.JobSpecInput = getJobSpec(model.result);
      addJob(jobInfos);
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

  useEffect(() => {
    if (accordionContentRef?.current) {
      accordionContentRef.current.style.position = showAdvancedConfiguration
        ? 'unset'
        : 'relative';
      if (showAdvancedConfiguration) {
        scrollToDiv('advancedConfig');
      }
    }
  }, [showAdvancedConfiguration, accordionContentRef?.current]);

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
            className="col-span-1 md:col-span-3 divide-y-[24px] divide-transparent"
          >
            <section id="name" data-testid="name-section">
              <h4 className="mb-2">{t('fieldDimensionLabel')}</h4>
              <FormField
                control={model.form.control}
                name="jobName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={classNameLabel}>
                      {t('fieldConfigurationNameLabel')}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={field.value} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <section id="region" data-testid="region-section">
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
                        onChange={(newRegion) => {
                          model.form.setValue('region', newRegion);
                          model.form.setValue('volumes', []);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <section id="flavor" data-testid="flavor-section">
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
                defaultValue={1}
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

            <section id="image" data-testid="image-section">
              <FormField
                control={model.form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={classNameLabel}>
                      {t('fieldImageLabel')}
                    </FormLabel>
                    <FormControl>
                      <ImagesSelect
                        {...field}
                        images={model.lists.presetImage}
                        value={field.value}
                        onChange={(newImage) =>
                          model.form.setValue('image', newImage)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <section id="access" data-testid="access-section">
              <FormField
                control={model.form.control}
                name="privacy"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className={classNameLabel}>
                      {t('fieldConfigurationPrivacyLabel')}
                    </FormLabel>
                    <div className="flex items-center space-x-2">
                      <RadioGroup
                        className="mb-2"
                        name="access-type"
                        value={field.value}
                        onValueChange={(newPrivacyValue: PrivacyEnum) =>
                          model.form.setValue('privacy', newPrivacyValue)
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={PrivacyEnum.private}
                            id="private-access-radio"
                          />

                          <Label>{t('privateAccess')}</Label>
                          <Popover>
                            <PopoverTrigger>
                              <HelpCircle className="size-4" />
                            </PopoverTrigger>
                            <PopoverContent className="text-sm">
                              <p>{t('privateAccessDescription')}</p>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={PrivacyEnum.public}
                            id="public-access"
                          />
                          <Label>{t('publicAccess')}</Label>
                          <Popover>
                            <PopoverTrigger>
                              <HelpCircle className="size-4" />
                            </PopoverTrigger>
                            <PopoverContent className="text-sm">
                              <p>{t('publicAccessDescription1')}</p>
                              <p className="text-red-600">
                                {t('publicAccessDescription2')}
                              </p>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </RadioGroup>
                    </div>
                  </FormItem>
                )}
              />
            </section>

            {/* Advanced configuration */}
            <section id="advancedConfig" data-testid="advance-config-section">
              <Card>
                <CardHeader>
                  <Button
                    data-testid="advanced-config-button"
                    type="button"
                    variant="ghost"
                    className="w-full flex flex-row items-center justify-between font-semibold text-xl"
                    onClick={() => {
                      setShowAdvancedConfiguration((prevValue) => !prevValue);
                    }}
                  >
                    {t('formButtonAdvancedConfiguration')}
                    {showAdvancedConfiguration ? (
                      <ChevronUp className="h-5 w-5 shrink-0 transition-transform duration-200" />
                    ) : (
                      <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent
                  ref={accordionContentRef}
                  data-state={showAdvancedConfiguration ? 'open' : 'closed'}
                  className={`
                  overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down
                  ${!showAdvancedConfiguration && 'max-h-0 py-0'}`}
                >
                  <div className="flex flex-col gap-6">
                    <section id="dockerCommand">
                      <FormField
                        control={model.form.control}
                        name="dockerCommand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={classNameLabel}>
                              {t('fieldDockerCommandLabel')}
                            </FormLabel>
                            <p>{t('fieldDockedCommandDescription')}</p>
                            <FormControl>
                              <DockerCommand
                                {...field}
                                commands={field.value}
                                onChange={(newCommands) =>
                                  model.form.setValue(
                                    'dockerCommand',
                                    newCommands,
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </section>
                    <section id="volumes">
                      <FormField
                        control={model.form.control}
                        name="volumes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={classNameLabel}>
                              {t('fieldVolumesLabel')}
                            </FormLabel>
                            <p>
                              {t('fieldVolumeDescription1')}{' '}
                              <OvhLink
                                application="public-cloud"
                                path={`#/pci/projects/${projectId}/ai/dashboard/datastore`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {t('fieldVolumeDashboardLink')}
                                <ArrowRight className="size-4 inline ml-1" />
                              </OvhLink>
                            </p>
                            <p>{t('fieldVolumeDescription2')}</p>
                            <A
                              href={getHowToManageDataInAIDocLink(locale)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t('fieldVolumeLink')}
                              <ArrowRight className="size-4 inline ml-1" />
                            </A>
                            <FormControl>
                              <VolumeForm
                                {...field}
                                configuredVolumesList={model.lists.volumes}
                                selectedVolumesList={field.value}
                                onChange={(newVolumes) =>
                                  model.form.setValue('volumes', newVolumes)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </section>
                    <section id="sshKey">
                      <FormField
                        control={model.form.control}
                        name="sshKey"
                        render={({ field }) => (
                          <FormItem>
                            <div>
                              <FormLabel className={classNameLabel}>
                                {t('fieldConfigurationSSHKeysLabel')}
                              </FormLabel>
                            </div>
                            <div className="flex flex-row gap-2">
                              <Button
                                data-testid="sshkey-add-button"
                                variant={'outline'}
                                size="sm"
                                className="text-base"
                                type="button"
                                onClick={() => navigate('./add-sshkey')}
                              >
                                <Plus className="size-4 mr-2" />
                                {t('sshkeyAddButtonLabel')}
                              </Button>
                              <Popover>
                                <PopoverTrigger>
                                  <HelpCircle className="size-4" />
                                </PopoverTrigger>
                                <PopoverContent className="text-sm">
                                  <p>{t('sshKeyConfigurationHelper')}</p>
                                </PopoverContent>
                              </Popover>
                            </div>
                            <FormControl>
                              <SshKeyForm
                                {...field}
                                configuredSshKeys={sshKeys}
                                sshKeyList={field.value}
                                onChange={(newSshKey) =>
                                  model.form.setValue('sshKey', newSshKey)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </section>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
          <Card className="sticky top-4 h-fit shadow-lg">
            <CardHeader>
              <CardTitle>{t('summaryTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              <OrderSummary
                order={model.result}
                onSectionClicked={(target) => {
                  if (['volumes', 'commandDocker', 'sshKey'].includes(target)) {
                    setShowAdvancedConfiguration(true);
                  }
                  scrollToDiv(target);
                }}
              />
              {model.result.flavor && (
                <OrderPrice
                  minuteConverter={60} // affichage du prix à l'heure
                  price={model.result.flavor.pricing[0]}
                  quantity={model.result.resourcesQuantity}
                />
              )}
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button
                data-testid="cli-command-button"
                type="button"
                variant="link"
                disabled={isPendingCommand}
                onClick={() => {
                  getCliCommand();
                  cliEquivalentModale.open();
                }}
                className="flex flex-row gap-2 items-center font-semibold"
              >
                {t('cliCode')} <TerminalSquare className="size-4 stroke-2" />
              </Button>
              <Button
                type="submit"
                data-testid="order-submit-button"
                className="w-full"
                disabled={isPendingAddJob}
              >
                {t('orderButton')}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      <CliEquivalent
        controller={cliEquivalentModale.controller}
        command={command}
      />
    </>
  );
};
export default OrderFunnel;
