import { useTranslation } from 'react-i18next';
import { AlertCircle, HelpCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { OrderVolumes, PrivacyEnum } from '@/types/orderFunnel';

interface OrderFunnelProps {
  regions: ai.capabilities.Region[];
  catalog: order.publicOrder.Catalog;
  frameworks: ai.capabilities.notebook.Framework[];
  editors: ai.capabilities.notebook.Editor[];
  sshKeys: SshKey[];
}

const OrderFunnel = ({
  regions,
  catalog,
  frameworks,
  editors,
  sshKeys,
}: OrderFunnelProps) => {
  const model = useOrderFunnel(regions, catalog, frameworks, editors);
  const { t } = useTranslation('pci-ai-notebooks/notebooks/create');
  const navigate = useNavigate();

  const { toast } = useToast();
  const { projectId } = useParams();
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
            className="col-span-1 md:col-span-3 divide-y-[1rem] divide-transparent"
          >
            <h4>{t('fieldDimensionLabel')}</h4>
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
            <h4>{t('fieldCaracteristicLabel')}</h4>
            <section id="framework">
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
                        value={field.value}
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

            <section id="volumes">
              <FormField
                control={model.form.control}
                name="volumes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={classNameLabel}>
                      {t('fieldVolumesLabel')}
                    </FormLabel>
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
                          Vous n'avez pas de volumes configurés. Configurer un
                          S3 ou Git / Configurer un container Swift
                        </p>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <section
              id="options"
              className="divide-y-[1rem] divide-transparent"
            >
              <h4>{t('fieldConfigurationLabel')}</h4>
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
                            <PopoverContent>
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
            <section
              id="options-sshkeys"
              className="divide-y-[1rem] divide-transparent"
            >
              <FormField
                control={model.form.control}
                name="sshKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={classNameLabel}>
                      {t('fieldConfigurationSSHKeysLabel')}
                    </FormLabel>
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
          <Card className="sticky top-4 h-fit shadow-lg">
            <CardHeader>
              <CardTitle>{t('summaryTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              <OrderSummary
                order={model.result}
                onSectionClicked={(section) => scrollToDiv(section)}
              />
              {model.result.flavor && (
                <OrderPrice
                  price={model.result.flavor.pricing[0]}
                  quantity={model.result.resourcesQuantity}
                />
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                data-testid="order-submit-button"
                className="w-full"
                // disabled={isPendingAddService || isProjectDiscoveryMode}
              >
                {t('orderButton')}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
};
export default OrderFunnel;
