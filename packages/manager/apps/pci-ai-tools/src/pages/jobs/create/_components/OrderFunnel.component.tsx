import { useTranslation } from 'react-i18next';
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Plus,
  TerminalSquare,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  useToast,
} from '@datatr-ux/uxlib';
import * as sshKey from '@datatr-ux/ovhcloud-types/cloud/sshkey/index';
import RegionsSelect from '@/components/order/region/RegionSelect.component';
import FlavorsSelect from '@/components/order/flavor/FlavorSelect.component';
import OrderPrice from '@/components/order/price/OrderPrice.component';
import SshKeyForm from '@/components/order/configuration/SshKeyForm.component';
import VolumeForm from '@/components/order/volumes/VolumesForm.component';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import ErrorList from '@/components/order/error-list/ErrorList.component';
import { JobSuggestions, PrivacyEnum } from '@/types/orderFunnel';
import { useModale } from '@/hooks/useModale';
import CliEquivalent from './CliEquivalent.component';
import { useOrderFunnel } from './useOrderFunnel.hook';
import OrderSummary from './OrderSummary.component';
import PrivacyRadioInput from '@/components/order/privacy-radio/PrivacyRadio.component';
import ai from '@/types/AI';
import publicCatalog from '@/types/Catalog';
import { useAddJob } from '@/data/hooks/ai/job/useAddJob.hook';
import { useGetCommand } from '@/data/hooks/ai/job/useGetCommand.hook';
import { getJobSpec } from '@/lib/orderFunnelHelper';
import JobImagesSelect from '@/components/order/job-image/JobImageSelect.component';
import DockerCommand from '@/components/order/docker-command/DockerCommand.component';

interface OrderJobsFunnelProps {
  regions: ai.capabilities.Region[];
  catalog: publicCatalog.Catalog;
  presetImage: ai.job.PresetImage[];
  sshKeys: sshKey.SshKey[];
  suggestions: JobSuggestions;
}

const OrderFunnel = ({
  regions,
  catalog,
  presetImage,
  sshKeys,
  suggestions,
}: OrderJobsFunnelProps) => {
  const model = useOrderFunnel(regions, catalog, presetImage, suggestions);

  const { t } = useTranslation('ai-tools/jobs/create');
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

  const classNameLabel = 'scroll-m-20 text-xl font-bold';

  return (
    <>
      <Form {...model.form}>
        <form
          className="grid grid-cols-1 lg:grid-cols-4 gap-4"
          onSubmit={onSubmit}
        >
          <div
            data-testid="order-funnel-container"
            className="col-span-1 md:col-span-3"
          >
            <Card
              id="name"
              data-testid="name-section"
              className="shadow-sm mt-4"
            >
              <CardHeader>
                <CardTitle>{t('fieldConfigurationNameLabel')}</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={model.form.control}
                  name="jobName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder={field.value} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card
              id="region"
              data-testid="region-section"
              className="shadow-sm mt-4"
            >
              <CardHeader>
                <CardTitle>{t('fieldRegionLabel')}</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={model.form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
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
              </CardContent>
            </Card>

            <Card
              id="flavor"
              data-testid="flavor-section"
              className="shadow-sm mt-4"
            >
              <CardHeader>
                <CardTitle>{t('fieldFlavorLabel')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-2">
                  {t('fieldFlavorDescription')}
                </CardDescription>
                <FormField
                  control={model.form.control}
                  name="flavorWithQuantity.flavor"
                  render={({ field }) => (
                    <FormItem>
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
                            model.form.setValue(
                              'flavorWithQuantity.quantity',
                              1,
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardContent>
                <CardDescription className="mb-2">
                  {t('fieldFlavorQuantityDescription')}
                </CardDescription>
                <FormField
                  control={model.form.control}
                  defaultValue={1}
                  name="flavorWithQuantity.quantity"
                  render={({ field }) => (
                    <FormItem>
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
              </CardContent>
            </Card>

            <Card
              id="image"
              data-testid="image-section"
              className="shadow-sm mt-4"
            >
              <CardHeader>
                <CardTitle>{t('fieldImageLabel')}</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={model.form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <JobImagesSelect
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
              </CardContent>
            </Card>

            <Card
              id="access"
              data-testid="access-section"
              className="shadow-sm mt-4"
            >
              <CardHeader>
                <CardTitle>{t('fieldConfigurationPrivacyLabel')}</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={model.form.control}
                  name="privacy"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <PrivacyRadioInput
                        value={field.value}
                        onChange={(newPrivacyValue: PrivacyEnum) =>
                          model.form.setValue('privacy', newPrivacyValue)
                        }
                        className={classNameLabel}
                      />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Advanced configuration */}
            <section id="advancedConfig" data-testid="advance-config-section">
              <Card className="mt-4">
                <CardHeader>
                  <Button
                    data-testid="advanced-config-button"
                    type="button"
                    mode="ghost"
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
                  p-0 px-6 overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down
                  ${!showAdvancedConfiguration && 'max-h-0 py-0'}`}
                >
                  <div className="flex flex-col gap-6">
                    <section id="dockerCommand">
                      <FormField
                        control={model.form.control}
                        name="dockerCommand"
                        render={({ field }) => (
                          <FormItem>
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
                    <section id="sshKey" className="pb-6">
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
                                mode="outline"
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
              <Separator className="my-2" />
              {model.result.flavor && (
                <OrderPrice
                  minuteConverter={60} // affichage du prix à l'heure
                  price={model.result.flavor.pricing[0]}
                  quantity={model.result.resourcesQuantity}
                />
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button
                data-testid="cli-command-button"
                type="button"
                disabled={isPendingCommand}
                onClick={() => {
                  getCliCommand();
                  cliEquivalentModale.open();
                }}
                className="flex flex-row gap-2 items-center underline bg-transparent hover:bg-transparent font-bold text-primary underline-offset-4 hover:underline"
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
