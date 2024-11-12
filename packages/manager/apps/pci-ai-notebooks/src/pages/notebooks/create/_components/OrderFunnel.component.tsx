import { useTranslation } from 'react-i18next';
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Plus,
  TerminalSquare,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import * as ai from '@/types/cloud/project/ai';
import { order } from '@/types/catalog';
import { useOrderFunnel } from './useOrderFunnel.hook';
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
import OrderSummary from './OrderSummary.component';
import { Button } from '@/components/ui/button';
import RegionsSelect from '@/components/order/region/RegionSelect.component';
import FlavorsSelect from '@/components/order/flavor/FlavorSelect.component';
import { Input } from '@/components/ui/input';
import OrderPrice from '@/components/order/price/OrderPrice.component';
import FrameworksSelect from '@/components/order/framework/FrameworkSelect.component';
import EditorsSelect from '@/components/order/editor/EditorSelect.component';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import LabelsForm from '@/components/order/configuration/LabelsForm.component';
import SshKeyForm from '@/components/order/configuration/SshKeyForm.component';
import { SshKey } from '@/types/cloud/sshkey';
import VolumeForm from '@/components/order/volumes/VolumesForm.component';
import { useAddNotebook } from '@/hooks/api/ai/notebook/useAddNotebook.hook';
import { useToast } from '@/components/ui/use-toast';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import ErrorList from '@/components/order/error-list/ErrorList.component';
import {
  OrderSshKey,
  OrderVolumes,
  PrivacyEnum,
  Suggestions,
} from '@/types/orderFunnel';
import { useModale } from '@/hooks/useModale';
import { useGetCommand } from '@/hooks/api/ai/notebook/useGetCommand.hook';
import CliEquivalent from './CliEquivalent.component';
import AddSSHKey from '@/pages/_components/AddSSHKey.component';

interface OrderFunnelProps {
  regions: ai.capabilities.Region[];
  catalog: order.publicOrder.Catalog;
  frameworks: ai.capabilities.notebook.Framework[];
  editors: ai.capabilities.notebook.Editor[];
  sshKeys: SshKey[];
  suggestions: Suggestions[];
}

const OrderFunnel = ({
  regions,
  catalog,
  frameworks,
  editors,
  sshKeys,
  suggestions,
}: OrderFunnelProps) => {
  const model = useOrderFunnel(
    regions,
    catalog,
    frameworks,
    editors,
    suggestions,
  );
  const { t } = useTranslation('pci-ai-notebooks/notebooks/create');
  const [showAdvancedConfiguration, setShowAdvancedConfiguration] = useState(
    false,
  );
  const accordionContentRef = useRef(null);
  const cliEquivalentModale = useModale('cli');
  const navigate = useNavigate();

  const { toast } = useToast();
  const [command, setCommand] = useState<ai.Command>({});

  const addSshKeyModale = useModale('addSshKey');
  const { addNotebook, isPending: isPendingAddNotebook } = useAddNotebook({
    onError: (err) => {
      toast({
        title: t('errorCreatingNotebook'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
    },
    onSuccess: (notebook) => {
      toast({
        title: t('successCreatingNotebook'),
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
    const notebookInfos: ai.notebook.NotebookSpec = {
      env: {
        frameworkId: model.result.framework.id,
        frameworkVersion: model.form.getValues('frameworkWithVersion.version'),
        editorId: model.result.editor.id,
      },
      region: model.result.region.id,
      unsecureHttp: model.result.unsecureHttp,
      sshPublicKeys: model.result.sshKey,
      labels: model.result.labels,
    };

    if (model.result.flavor.type === ai.capabilities.FlavorTypeEnum.cpu) {
      notebookInfos.resources = {
        flavor: model.result.flavor.id,
        cpu: model.result.resourcesQuantity,
      };
    } else {
      notebookInfos.resources = {
        flavor: model.result.flavor.id,
        gpu: model.result.resourcesQuantity,
      };
    }

    if (model.result.volumes.length > 0) {
      notebookInfos.volumes = model.result.volumes.map(
        (volume: OrderVolumes) => ({
          cache: volume.cache,
          dataStore: {
            alias: volume.dataStore.alias,
            container: volume.dataStore.container,
          },
          mountPath: volume.mountPath,
          permission: volume.permission,
        }),
      );
    }
    getCommand(notebookInfos);
  };

  const onSubmit = model.form.handleSubmit(
    (data) => {
      const notebookInfos: ai.notebook.NotebookSpec = {
        env: {
          frameworkId: data.frameworkWithVersion.framework,
          frameworkVersion: data.frameworkWithVersion.version,
          editorId: data.editor,
        },
        region: data.region,
        unsecureHttp: model.result.unsecureHttp,
        sshPublicKeys: model.result.sshKey,
        labels: model.result.labels,
      };

      if (model.result.flavor.type === ai.capabilities.FlavorTypeEnum.cpu) {
        notebookInfos.resources = {
          flavor: data.flavorWithQuantity.flavor,
          cpu: data.flavorWithQuantity.quantity,
        };
      } else {
        notebookInfos.resources = {
          flavor: data.flavorWithQuantity.flavor,
          gpu: data.flavorWithQuantity.quantity,
        };
      }

      if (data.volumes.length > 0) {
        notebookInfos.volumes = data.volumes.map((volume: OrderVolumes) => ({
          cache: volume.cache,
          dataStore: {
            alias: volume.dataStore.alias,
            container: volume.dataStore.container,
          },
          mountPath: volume.mountPath,
          permission: volume.permission,
        }));
      }
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
            <section id="name">
              <h4 className="mb-2">{t('fieldDimensionLabel')}</h4>
              <FormField
                control={model.form.control}
                name="notebookName"
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

            <section id="flavor">
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

            <section id="framework">
              <h4 className="mb-2">{t('fieldCaracteristicLabel')}</h4>
              <FormField
                control={model.form.control}
                name="frameworkWithVersion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={classNameLabel}>
                      {t('fieldFrameworkLabel')}
                    </FormLabel>
                    <FormControl>
                      <FrameworksSelect
                        {...field}
                        frameworks={model.lists.frameworks}
                        value={model.form.getValues('frameworkWithVersion')}
                        onChange={(newFrameworkWithVersion) =>
                          model.form.setValue(
                            'frameworkWithVersion',
                            newFrameworkWithVersion,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
            <section id="editor">
              <FormField
                control={model.form.control}
                name="editor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={classNameLabel}>
                      {t('fieldEditorLabel')}
                    </FormLabel>
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
            </section>

            <section id="access">
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
            <section id="advancedConfig">
              <Card>
                <CardHeader>
                  <Button
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
                  ${
                    showAdvancedConfiguration ? 'max-h-screen' : 'max-h-0 py-0'
                  }`}
                >
                  <div className="flex flex-col gap-6">
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
                              Faire un petit laius sur les volumes, à quoi ils
                              servent, comment les configurer et tout ci tout ca
                            </p>
                            <FormControl>
                              {model.lists.volumes.length > 0 ? (
                                <VolumeForm
                                  {...field}
                                  configuredVolumesList={model.lists.volumes}
                                  selectedVolumesList={field.value}
                                  onChange={(newVolumes) =>
                                    model.form.setValue('volumes', newVolumes)
                                  }
                                />
                              ) : (
                                <p>
                                  Vous n'avez pas de volumes configurés.
                                  Configurer un S3 ou Git / Configurer un
                                  container Swift
                                </p>
                              )}
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
                                labelValue={field.value}
                                onChange={(newLabel) =>
                                  model.form.setValue('labels', newLabel)
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
                                onClick={() => addSshKeyModale.open()}
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
                  if (['volumes', 'labels', 'sshKey'].includes(target)) {
                    setShowAdvancedConfiguration(true);
                  }
                  scrollToDiv(target);
                }}
              />
              {model.result.flavor && (
                <OrderPrice
                  price={model.result.flavor.pricing[0]}
                  quantity={model.result.resourcesQuantity}
                />
              )}
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button
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
                disabled={isPendingAddNotebook}
              >
                {t('orderButton')}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      <AddSSHKey
        controller={addSshKeyModale.controller}
        configuredSshKeys={sshKeys}
        onSuccess={(sshKey: SshKey) => {
          addSshKeyModale.close();
          const newSshKeyList: OrderSshKey[] = model.form.getValues('sshKey');
          newSshKeyList.push({ name: sshKey.name, sshKey: sshKey.publicKey });
          model.form.setValue('sshKey', newSshKeyList);
        }}
      />
      <CliEquivalent
        controller={cliEquivalentModale.controller}
        command={command}
      />
    </>
  );
};
export default OrderFunnel;
