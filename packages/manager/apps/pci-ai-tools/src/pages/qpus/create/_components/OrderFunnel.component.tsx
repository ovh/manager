import { useTranslation } from 'react-i18next';
import { SshKey } from '@datatr-ux/ovhcloud-types/cloud/sshkey/index';
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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
  Switch,
  useToast,
} from '@datatr-ux/uxlib';
import { useOrderFunnel } from './useOrderFunnel.hook';
import ai from '@/types/AI';
import { useModale } from '@/hooks/useModale';
import { useAddNotebook } from '@/data/hooks/ai/notebook/useAddNotebook.hook';
import { useGetCommand } from '@/data/hooks/ai/notebook/useGetCommand.hook';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import { getNotebookSpec } from '@/lib/orderFunnelHelper';
import ErrorList from '@/components/order/error-list/ErrorList.component';
import RegionsSelect from '@/components/order/region/RegionSelect.component';
import FlavorsSelect from '@/components/order/flavor/FlavorSelect.component';
import QpusSelect from '@/components/order/qpu/QpuSelect.component';
import FrameworksSelect from '@/components/order/framework/FrameworkSelect.component';
import EditorsSelect from '@/components/order/editor/EditorSelect.component';
import PrivacyRadioInput from '@/components/order/privacy-radio/PrivacyRadio.component';
import { NotebookSuggestions, PrivacyEnum } from '@/types/orderFunnel';
import VolumeForm from '@/components/order/volumes/VolumesForm.component';

import LabelsForm from '@/components/labels/LabelsForm.component';
import { AutoRestartSection } from '@/components/auto-restart/AutoRestartSection.component';
import SshKeyForm from '@/components/order/configuration/SshKeyForm.component';
import OrderSummary from './OrderSummary.component';
import CliEquivalent from './CliEquivalent.component';
import publicCatalog from '@/types/Catalog';
import { cn } from '@/lib/utils';
import { useTrackAction, useTrackBanner } from '@/hooks/useTracking';
import { TRACKING } from '@/configuration/tracking.constants';
import Price from '@/components/price/Price.component';
import quantum from '@/types/Quantum';

interface OrderFunnelProps {
  regions: quantum.capabilities.Region[];
  catalog: publicCatalog.Catalog;
  sshKeys: SshKey[];
  suggestions: NotebookSuggestions;
}

const OrderFunnel = ({
  regions,
  catalog,
  sshKeys,
  suggestions,
}: OrderFunnelProps) => {
  const model = useOrderFunnel(regions, catalog, suggestions);
  const trackBanner = useTrackBanner();
  const track = useTrackAction();
  const { t } = useTranslation('ai-tools/qpu/create');
  const { projectId } = useParams();
  // Manage datastore combobox
  const [openVersionCb, setOpenVersionCb] = useState(false);
  const [showAdvancedConfiguration, setShowAdvancedConfiguration] = useState(
    false,
  );
  const accordionContentRef = useRef(null);
  const cliEquivalentModale = useModale('cli');
  const navigate = useNavigate();
  const handleAddSshKeyClick = () => {
    track(TRACKING.qpus.funnel.configureSshKeyClick(), 'funnel');
    navigate('./add-sshkey');
  };
  const getConfirmNotebookTrackingName = () =>
    TRACKING.qpus.funnel.confirmNotebookClick();

  const { toast } = useToast();
  const [command, setCommand] = useState<ai.Command>({ command: '' });
  const getCreateNotebookBannerTrackingName = (
    type: 'info' | 'error',
    status: 'pending' | 'alert' | 'success' | 'error',
  ) => TRACKING.qpus.banner.createNotebookBanner(type, status);

  const { addNotebook, isPending: isPendingAddNotebook } = useAddNotebook({
    onError: (err) => {
      trackBanner(
        getCreateNotebookBannerTrackingName('error', 'error'),
        'banner',
      );
      toast({
        title: t('errorCreatingNotebook'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
    },
    onSuccess: (notebook) => {
      trackBanner(
        getCreateNotebookBannerTrackingName('info', 'success'),
        'banner',
      );
      toast({
        title: t('successCreatingNotebookTitle'),
        description: t('successCreatingNotebookDescription'),
      });
      navigate(`../${notebook.id}`);
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
    const notebookInfo: ai.notebook.NotebookSpecInput = getNotebookSpec(
      model.result,
    );
    getCommand({ projectId, notebookInfo });
  };

  const onSubmit = model.form.handleSubmit(
    () => {
      const notebookInfos: ai.notebook.NotebookSpecInput = getNotebookSpec(
        model.result,
      );

      track(getConfirmNotebookTrackingName(), 'funnel');
      addNotebook(notebookInfos);
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
                  name="notebookName"
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
                  render={({ field }) => {
                    return (
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
                    );
                  }}
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
              id="framework"
              data-testid="framework-section"
              className="shadow-sm mt-4"
            >
              <CardHeader>
                <CardTitle>{t('fieldFrameworkLabel')}</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={model.form.control}
                  name="frameworkWithVersion.framework"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        {model.result.framework && (
                          <FrameworksSelect
                            {...field}
                            frameworks={model.lists.frameworks}
                            value={model.result.framework?.id}
                            onChange={(newFramework) => {
                              model.form.setValue(
                                'frameworkWithVersion.framework',
                                newFramework,
                              );
                              model.form.setValue(
                                'frameworkWithVersion.version',
                                model.lists.frameworks.find(
                                  (fmk) => fmk.id === newFramework,
                                ).versions[0],
                              );
                            }}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              {model.result.framework?.versions.length > 1 && (
                <CardContent>
                  <CardDescription>
                    {t('fieldFrameworkVersionDescription')}
                  </CardDescription>
                  <FormField
                    control={model.form.control}
                    defaultValue={model.result.version}
                    name="frameworkWithVersion.version"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Popover
                            open={openVersionCb}
                            onOpenChange={setOpenVersionCb}
                          >
                            <div
                              data-testid="fmk-tile-version-container"
                              className="hidden"
                            >
                              {model.result.framework?.versions.map(
                                (fmkVersion) => (
                                  <input
                                    type="radio"
                                    name="version-select"
                                    value={fmkVersion}
                                    key={fmkVersion}
                                    readOnly
                                    checked={fmkVersion === field.value}
                                  />
                                ),
                              )}
                            </div>
                            <PopoverTrigger asChild>
                              <Button
                                data-testid="popover-trigger-button"
                                size="sm"
                                mode="outline"
                                className="text-text"
                              >
                                {field.value}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-full p-0"
                              side="bottom"
                            >
                              <Command>
                                <CommandInput
                                  placeholder={t('select a version')}
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    {t('noVersionFound')}
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {model.result.framework?.versions.map(
                                      (fmkVersion) => (
                                        <CommandItem
                                          key={fmkVersion}
                                          value={fmkVersion}
                                          onSelect={(value) => {
                                            model.form.setValue(
                                              'frameworkWithVersion.version',
                                              value,
                                            );
                                            setOpenVersionCb(false);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              'mr-2 h-4 w-4',
                                              fmkVersion === field.value
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                            )}
                                          />
                                          <span className="w-full cursor-pointer overflow-hidden">
                                            {fmkVersion}
                                          </span>
                                        </CommandItem>
                                      ),
                                    )}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              )}

              <CardContent>
                <CardDescription className="mb-2">
                  {t('fieldFQpuDescription')}
                </CardDescription>

                <FormField
                  control={model.form.control}
                  name="qpuFlavor"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <QpusSelect
                            {...field}
                            qpus={model.lists.qpuFlavors}
                            value={field.value}
                            onChange={(newQPUFlavor) => {
                              model.form.setValue('qpuFlavor', newQPUFlavor);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </CardContent>
            </Card>
            <Card
              id="editor"
              data-testid="editor-section"
              className="shadow-sm mt-4"
            >
              <CardHeader>
                <CardTitle>{t('fieldEditorLabel')}</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={model.form.control}
                  name="editor"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <EditorsSelect
                          {...field}
                          editors={model.lists.editors}
                          value={field.value}
                          onChange={(newEditor) =>
                            model.form.setValue('editor', newEditor)
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
                      />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Auto Restart */}
            <Card
              id="autorestart"
              data-testid="autorestart-section"
              className="shadow-sm mt-4"
            >
              <CardHeader>
                <CardTitle>{t('fieldTimeOutLabel')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-2">
                  <AlertCircle className="inline size-4 shrink-0 mr-1 mb-1 text-amber-500" />
                  {t('defaultAutoRestartInfo')}
                </CardDescription>
                <AutoRestartSection form={model.form} app="qpus" />
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
                    className="w-full flex flex-row items-center justify-between font-semibold text-xl text-primary-500"
                    onClick={() => {
                      track(
                        TRACKING.qpus.funnel.advancedConfigurationClick(),
                        'funnel',
                      );
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
                  ${!showAdvancedConfiguration && 'max-h-0'}`}
                >
                  <div className="flex flex-col gap-6">
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
                    <section id="labels">
                      <FormField
                        control={model.form.control}
                        name="labels"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={classNameLabel}>
                              {t('fieldConfigurationLabelsLabel')}
                            </FormLabel>
                            <FormControl>
                              <LabelsForm
                                {...field}
                                configuredLabels={field.value}
                                onChange={(newLabels: ai.Label[]) =>
                                  model.form.setValue('labels', newLabels)
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
                            <p>{t('sshKeyConfigurationHelper')}</p>
                            <p>
                              <AlertCircle className="inline size-4 shrink-0 mr-1 mb-1 text-amber-500" />
                              {t('sshKeyConfigurationHelperBis')}
                            </p>
                            <Button
                              data-testid="sshkey-add-button"
                              mode="outline"
                              size="sm"
                              className="text-base"
                              type="button"
                              onClick={handleAddSshKeyClick}
                            >
                              <Plus className="size-4 mr-2" />
                              {t('sshkeyAddButtonLabel')}
                            </Button>
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
                  if (['volumes', 'labels', 'sshKey'].includes(target)) {
                    setShowAdvancedConfiguration(true);
                  }
                  scrollToDiv(target);
                }}
              />
              <Separator className="my-2" />
              <p>{t('pricingLabel')}</p>
              <span>
                <div className="flex justify-between items-center">
                  <span>{t('notebookPrice')}</span>
                  <span className="text-sm text-right">
                    {model.result.flavor && (
                      <Price
                        decimals={2}
                        priceInUcents={
                          (model.result.flavor?.pricing[0]?.price || 0) *
                          (model.result.resourcesQuantity || 0) *
                          60
                        }
                        taxInUcents={
                          (model.result.flavor?.pricing[0]?.tax || 0) *
                          (model.result.resourcesQuantity || 0) *
                          60
                        }
                        displayInHour={false}
                      />
                    )}
                  </span>
                </div>

                <Separator className="my-1" />

                {model.result.qpuFlavor && (
                  <>
                    <div className="flex justify-between items-center">
                      <span>{t('qpuPrice')}</span>
                      <span className="text-sm text-right">
                        <Price
                          decimals={2}
                          priceInUcents={
                            (model.result.qpuFlavor?.pricing[0]?.price || 0) *
                            3600
                          }
                          taxInUcents={
                            (model.result.qpuFlavor?.pricing[0]?.tax || 0) *
                            3600
                          }
                          displayInHour={false}
                        />
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      {/* Note d'information */}
                      <div className="mt-4 bg-[#B3E5FC] border  rounded-xl p-3 flex items-start gap-2">
                        <AlertCircle
                          className="text-[#1E88E5] mt-0.5 flex-shrink-0"
                          size={18}
                        />
                        <p className="text-sm text-[#4A55A2] leading-snug">
                          {t('notePriceDesc')}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </span>
              <Separator className="my-1" />
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
                disabled={isPendingAddNotebook}
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
