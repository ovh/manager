import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, TerminalSquare } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
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
  Input,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToast,
} from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import RegionsSelect from '@/components/order/region/RegionSelect.component';
import FlavorsSelect from '@/components/order/flavor/FlavorSelect.component';
import VolumeForm from '@/components/order/volumes/VolumesForm.component';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import ErrorList from '@/components/order/error-list/ErrorList.component';
import { AppSuggestions, PrivacyEnum } from '@/types/orderFunnel';
import { useModale } from '@/hooks/useModale';
import CliEquivalent from './CliEquivalent.component';
import { useOrderFunnel } from './useOrderFunnel.hook';
import OrderSummary from './OrderSummary.component';
import DockerCommand from '@/components/order/docker-command/DockerCommand.component';
import AppImagesSelect from '@/components/order/app-image/AppImageSelect.component';
import LabelsForm from '@/components/labels/LabelsForm.component';
import { getAppSpec } from '@/lib/orderFunnelHelper';
import ScalingStrategy from '@/components/order/app-scaling/ScalingStrategy.component';
import Price from '@/components/price/Price.component';
import { APP_CONFIG } from '@/configuration/app';
import ProbeForm from '@/components/order/app-probe/ProbeForm.component';
import PrivacyRadioInput from '@/components/order/privacy-radio/PrivacyRadio.component';
import publicCatalog from '@/types/Catalog';
import { useAddApp } from '@/data/hooks/ai/app/useAddApp.hook';
import { useSignPartnerContract } from '@/data/hooks/ai/partner/useSignPartnerContract.hook';
import { useGetCommand } from '@/data/hooks/ai/app/useGetCommand.hook';
import { PartnerApp } from '@/data/api/ai/partner/partner.api';

interface OrderAppsFunnelProps {
  regions: ai.capabilities.Region[];
  catalog: publicCatalog.Catalog;
  suggestions: AppSuggestions;
}

const OrderFunnel = ({
  regions,
  catalog,
  suggestions,
}: OrderAppsFunnelProps) => {
  const model = useOrderFunnel(regions, catalog, suggestions);
  const { t } = useTranslation('ai-tools/apps/create');
  const { projectId } = useParams();
  const [isPartnerSelected, setIsPartnerSelected] = useState(false);
  const [showAdvancedConfiguration, setShowAdvancedConfiguration] = useState(
    false,
  );
  const [invalidScalingInput, setInvalidScalingInput] = useState(false);
  const accordionContentRef = useRef(null);
  const cliEquivalentModale = useModale('cli');
  const navigate = useNavigate();

  const { toast } = useToast();
  const [command, setCommand] = useState<ai.Command>({ command: '' });

  const { addApp, isPending: isPendingAddApp } = useAddApp({
    onError: (err) => {
      toast({
        title: t('errorCreatingApp'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
    },
    onSuccess: (app) => {
      toast({
        title: t('successCreatingAppTitle'),
        description: t('successCreatingAppDescription'),
      });
      navigate(`../${app.id}`);
    },
  });

  const { signPartnerContract } = useSignPartnerContract({
    onError: (err) => {
      toast({
        title: t('errorSigningContract'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
      throw new Error(err.message);
    },
    onSuccess: () => {
      const appInfo: ai.app.AppSpecInput = getAppSpec(
        model.result,
        model.lists.appImages,
      );
      addApp(appInfo);
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
      cliEquivalentModale.open();
    },
  });

  const getCliCommand = () => {
    const appInfo: ai.app.AppSpecInput = getAppSpec(
      model.result,
      model.lists.appImages,
    );
    getCommand({ projectId, appInfo });
  };

  const scrollToDiv = (target: string) => {
    const div = document.getElementById(target);
    if (div) {
      div.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const throwErrorContract = () => {
    scrollToDiv('image');
    model.form.setError('image.name', {
      type: 'custom',
      message: t('formErrorPartnerContractNotSign'),
    });
    toast({
      title: t('errorFormTitle'),
      variant: 'destructive',
      description: <ErrorList error={model.form.control._formState.errors} />,
    });
    throw new Error(t('formErrorPartnerContractNotSign'));
  };

  const onSubmit = model.form.handleSubmit(
    () => {
      // if partner Image and contract not checked, throw error
      if (!model.result.isContractChecked) throwErrorContract();
      // if partner Image and contract need to be sign
      if (!model.result.isContractSigned) {
        const signPartnerInfo: PartnerApp = {
          projectId,
          region: model.result.region.id,
          partnerId: model.lists.appImages.find(
            (app) => app.id === model.result.image,
          ).partnerId,
        };
        // Sign and deploy app
        signPartnerContract(signPartnerInfo);
      } else {
        // Deploy the app
        const appInfo: ai.app.AppSpecInput = getAppSpec(
          model.result,
          model.lists.appImages,
        );
        addApp(appInfo);
      }
    },
    (error) => {
      toast({
        title: t('errorFormTitle'),
        variant: 'destructive',
        description: <ErrorList error={error} />,
      });
    },
  );

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
            className="col-span-1 md:col-span-3 divide-y-[24px] divide-transparent"
          >
            <section id="name" data-testid="name-section">
              <Label className="mb-2 text-xl font-semibold">
                {t('fieldDimensionLabel')}
              </Label>
              <FormField
                control={model.form.control}
                name="appName"
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
                    <p className="mt-2 text-sm">
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
                name="image.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={classNameLabel}>
                      {t('fieldImageLabel')}
                    </FormLabel>
                    <FormControl>
                      <AppImagesSelect
                        {...field}
                        appImages={model.lists.appImages}
                        version={model.form.getValues('image.version')}
                        value={field.value}
                        onChange={(newImage, newVersion, contractChecked) => {
                          model.form.setValue('image.name', newImage);
                          model.form.setValue('image.version', newVersion);
                          // ContractChecked is set to true for customImage
                          model.form.setValue(
                            'image.contractChecked',
                            contractChecked ?? true,
                          );
                          // remove errors onChange
                          model.form.trigger('image.name');

                          if (newVersion) {
                            model.form.setValue('volumes', []);
                            model.form.setValue('httpPort', 8080);
                            model.form.setValue('dockerCommand', []);
                            setIsPartnerSelected(true);
                          } else {
                            setIsPartnerSelected(false);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <section id="scaling">
              <FormField
                control={model.form.control}
                name="scaling"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={classNameLabel}>
                      {t('fielddScalingLabel')}
                    </FormLabel>
                    <FormControl>
                      <ScalingStrategy
                        {...field}
                        scaling={field.value}
                        onChange={(newScaling) =>
                          model.form.setValue('scaling', newScaling)
                        }
                        onNonValidForm={(val) => setInvalidScalingInput(val)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            {!isPartnerSelected && (
              <section id="httpPort">
                <FormField
                  control={model.form.control}
                  name="httpPort"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={classNameLabel}>
                        {t('fieldHttpPortLabel')}
                      </FormLabel>
                      <p className="text-sm">{t('fieldHttpPortDescription')}</p>
                      <FormControl>
                        <Input
                          type="number"
                          max={APP_CONFIG.port.max}
                          min={APP_CONFIG.port.min}
                          value={field.value}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>
            )}
            <section id="access" data-testid="access-section">
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
            </section>

            {/* Advanced configuration */}
            <section id="advancedConfig" data-testid="advance-config-section">
              <Card>
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
                  overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down
                  ${!showAdvancedConfiguration && 'max-h-0 py-0'}`}
                >
                  <div className="flex flex-col gap-6">
                    {!isPartnerSelected && (
                      <section id="command">
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
                    )}
                    {!isPartnerSelected && (
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
                    )}

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
                    <section id="probe">
                      <FormField
                        control={model.form.control}
                        name="probe"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={classNameLabel}>
                              {t('fieldConfigurationProbeLabel')}
                            </FormLabel>
                            <FormControl>
                              <ProbeForm
                                probeValue={field.value}
                                onChange={(newProbe) => {
                                  model.form.setValue(
                                    'probe.path',
                                    newProbe.path,
                                  );
                                  model.form.setValue(
                                    'probe.port',
                                    newProbe.port,
                                  );
                                }}
                                disabled={isPendingAddApp}
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
                  if (
                    ['scaling', 'volumes', 'commandDocker', 'sshKey'].includes(
                      target,
                    )
                  ) {
                    setShowAdvancedConfiguration(true);
                  }
                  scrollToDiv(target);
                }}
              />
              <Table>
                <TableHeader>
                  <TableRow className="text-sm">
                    <TableHead className="h-10 px-2">
                      {t('priceDetailsLabel')}
                    </TableHead>
                    <TableHead className="h-10 px-2">
                      {t('priceUnitLabel')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {model.result.pricing?.resourcePricing && (
                    <TableRow className="text-sm">
                      <TableCell className="py-1 px-2">
                        {t('priceRessourceLabel')}
                      </TableCell>
                      <TableCell className="py-1 px-2">
                        <Price
                          decimals={2}
                          priceInUcents={
                            model.result.pricing.resourcePricing?.price
                          }
                          taxInUcents={
                            model.result.pricing.resourcePricing?.tax
                          }
                          displayInHour={false}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                  {model.result.pricing?.scalingPricing && (
                    <TableRow className="text-sm">
                      <TableCell className="py-1 px-2">
                        {t('priceScalingLabel')}
                      </TableCell>
                      <TableCell className="py-1 px-2">
                        <Price
                          decimals={2}
                          priceInUcents={
                            model.result.pricing.scalingPricing.price
                          }
                          taxInUcents={model.result.pricing.scalingPricing.tax}
                          displayInHour={false}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                  {model.result.pricing?.partnerLicence && (
                    <TableRow className="text-sm">
                      <TableCell className="py-1 px-2">
                        {t('priceLicenceLabel')}
                      </TableCell>
                      <TableCell className="py-1 px-2">
                        <Price
                          decimals={2}
                          priceInUcents={
                            model.result.pricing.partnerLicence.price
                          }
                          taxInUcents={model.result.pricing.partnerLicence.tax}
                          displayInHour={false}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                  {model.result.pricing?.resourcePricing && (
                    <TableRow>
                      <TableCell className="py-1 px-2 font-bold">
                        {t('priceTotalLabel')}
                      </TableCell>
                      <TableCell className="py-1 px-2">
                        <Price
                          decimals={2}
                          priceInUcents={
                            model.result.pricing.resourcePricing.price +
                            (model.result.pricing?.partnerLicence?.price || 0) +
                            (model.result.pricing?.scalingPricing?.price || 0)
                          }
                          taxInUcents={
                            model.result.pricing.resourcePricing.tax +
                            (model.result.pricing?.partnerLicence?.tax || 0) +
                            (model.result.pricing?.scalingPricing?.tax || 0)
                          }
                          displayInHour={false}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
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
                disabled={isPendingAddApp || invalidScalingInput}
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
