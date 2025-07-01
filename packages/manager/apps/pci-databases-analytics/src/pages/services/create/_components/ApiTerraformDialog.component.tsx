import { Trans, useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import {
  Button,
  Code,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useToast,
} from '@datatr-ux/uxlib';
import {
  json as JsonLanguage,
  terraform as TerraformLanguage,
} from '@datatr-ux/uxlib/components/code';
import A from '@/components/links/A.component';
import { useServiceToTerraform } from '@/hooks/api/database/terraform/useServiceToTerraform';
import { useOrderFunnel } from './useOrderFunnel.hook';
import usePciProject from '@/hooks/api/project/usePciProject.hook';
import { ServiceCreationWithEngine } from '@/hooks/api/database/service/useAddService.hook';
import { useLocale } from '@/hooks/useLocale';

import * as TTerraform from '@/types/terraform';
import * as database from '@/types/cloud/project/database';
import { Disk } from '@/types/cloud/project/database/service/Disk';
import { LINKS, getDocumentationUrl } from '@/configuration/documentation';

type OrderFunnelModel = ReturnType<typeof useOrderFunnel>;

const ApiTerraformDialog = ({
  opened,
  onRequestClose,
  dialogData,
}: {
  opened: boolean;
  onRequestClose: () => void;
  dialogData: OrderFunnelModel;
}) => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  const projectData = usePciProject();
  const locale = useLocale();
  const { toast } = useToast();

  const [apiBodyContent, setApiBodyContent] = useState<{ [key: string]: any }>(
    {},
  );
  const [apiEndpoint, setApiEndpoint] = useState<string>('');

  // API and Terraform schemas description
  const [apiSchemaDescription] = useState<{ [key: string]: any }>({
    description: t('pciDatabasesAddCommandParametersInfoApiDescription'),
    'nodesPattern.flavor': t(
      'pciDatabasesAddCommandParametersInfoApiNetworkId',
    ),
    'nodesPattern.number': t('pciDatabasesAddCommandParametersInfoApiSubnetId'),
    'nodesPattern.region': t('pciDatabasesAddCommandParametersInfoApiDiskSize'),
    plan: t('pciDatabasesAddCommandParametersInfoApiNodesPatternFlavor'),
    version: t('pciDatabasesAddCommandParametersInfoApiNodesPatternNumber'),
    'disk.size': t('pciDatabasesAddCommandParametersInfoApiNodesPatternRegion'),
    networkId: t('pciDatabasesAddCommandParametersInfoApiPlan'),
    subnetId: t('pciDatabasesAddCommandParametersInfoApiVersion'),
  });
  const [terraformSchemaDescription] = useState<{ [key: string]: any }>({
    service_name: t('pciDatabasesAddCommandParametersInfoTerraformServiceName'),
    description: t('pciDatabasesAddCommandParametersInfoTerraformDescription'),
    engine: t('pciDatabasesAddCommandParametersInfoTerraformEngine'),
    version: t('pciDatabasesAddCommandParametersInfoTerraformVersion'),
    plan: t('pciDatabasesAddCommandParametersInfoTerraformPlan'),
    flavor: t('pciDatabasesAddCommandParametersInfoTerraformFlavor'),
    disk_size: t('pciDatabasesAddCommandParametersInfoTerraformDiskSize'),
    nodes: t('pciDatabasesAddCommandParametersInfoTerraformNodes'),
    'nodes.region': t(
      'pciDatabasesAddCommandParametersInfoTerraformNodesRegion',
    ),
    'nodes.network_id': t(
      'pciDatabasesAddCommandParametersInfoTerraformNodesNetworkId',
    ),
    'nodes.subnet_id': t(
      'pciDatabasesAddCommandParametersInfoTerraformNodesSubnetId',
    ),
  });

  const [terraformData, setTerraformData] = useState<
    TTerraform.cloud.Response['resource'] | null
  >('');
  const { serviceToTerraform } = useServiceToTerraform({
    onError: () => {},
    onSuccess: (data) => {
      setTerraformData(data?.resource);
    },
  });

  type TabType = 'api' | 'terraform';
  const [currentTab, setCurrentTab] = useState<TabType>('api');
  const handleTabChange = async (tab: TabType) => {
    setCurrentTab(tab);
    if (tab === 'terraform' && !terraformData) {
      // Handle Terraform data
      dialogData.form.handleSubmit(
        (data) => {
          const nodesList: TTerraform.cloud.database.service.Node[] = [];
          // Add nodes to nodesList depending on data.nbNodes
          for (let i = 0; i < data.nbNodes; i += 1) {
            nodesList.push({
              flavor: data.flavor,
              region: data.region,
            });
          }

          const terraformService: TTerraform.cloud.database.ServiceRequest = {
            body: {
              description: data.name,
              nodesList,
              plan: data.plan,
              version: `${data.engineWithVersion.version}`,
              ipRestrictions: data.ipRestrictions,
            },
            pathParams: {
              engine: data.engineWithVersion
                .engine as TTerraform.cloud.database.EngineEnum,
              serviceName: projectData.data?.project_id,
            },
          };
          if (dialogData.result.flavor.storage) {
            terraformService.body.disk = {
              size:
                dialogData.result.flavor.storage.minimum.value +
                data.additionalStorage,
            } as Disk;
          }
          serviceToTerraform(terraformService);
        },
        (error) => {
          console.error(error);
          toast({
            title: error,
            variant: 'destructive',
          });
        },
      )();
    }
  };

  useEffect(() => {
    // Validate form data
    dialogData.form.handleSubmit(
      (data) => {
        // API
        const apiBody: ServiceCreationWithEngine = {
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
        };
        if (data.network.type === database.NetworkTypeEnum.private) {
          const networkOpenstackId = dialogData.result.network.network.regions.find(
            (r) => r.region.includes(data.region),
          ).openstackId;
          apiBody.networkId = networkOpenstackId;
          apiBody.subnetId = data.network.subnetId;
        }
        if (dialogData.result.flavor.storage) {
          apiBody.disk = {
            size:
              dialogData.result.flavor.storage.minimum.value +
              data.additionalStorage,
          } as database.service.Disk;
        }
        // Destructure body to extract engine and keep the rest
        const { engine, ...formattedApiBody } = apiBody;
        setApiEndpoint(
          `/cloud/project/${projectData.data?.project_id}/database/${engine}`,
        );
        setApiBodyContent(formattedApiBody);
      },
      (error) => {
        console.error(error);
      },
    )();
  }, []);

  return (
    <>
      <Dialog open={opened} onOpenChange={onRequestClose}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {t('pciDatabasesAddCommandDialogEquivalentOrder')}
            </DialogTitle>
          </DialogHeader>
          <Tabs
            defaultValue={currentTab}
            value={currentTab}
            onValueChange={handleTabChange}
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="api" data-testid="api-tab">
                {t('pciDatabasesAddCommandDialogApiTabTitle')}
              </TabsTrigger>
              <TabsTrigger value="terraform" data-testid="terraform-tab">
                {t('pciDatabasesAddCommandDialogTerraformTabTitle')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="api" className="space-y-4">
              <p>{t('pciDatabasesAddCommandDialogApiDescription')}</p>
              <Trans
                t={t}
                i18nKey={'pciDatabasesAddCommandDialogDocumentationCta'}
                components={{
                  anchor: (
                    <A
                      target="_blank"
                      href={getDocumentationUrl(LINKS.DB_ORDER_EQ_API, locale)}
                    ></A>
                  ),
                }}
              ></Trans>
              <div>{t('pciDatabasesAddCommandDialogApiParameters')}</div>
              <div className="inline-flex items-center gap-1 font-mono text-sm">
                <span className="rounded bg-green-100 px-2 py-0.5 text-green-700 font-semibold">
                  POST
                </span>
                <span
                  className="bg-gray-100 px-2 py-0.5 rounded text-gray-800"
                  data-testid="dialog-api-endpoint"
                >
                  {apiEndpoint}
                </span>
              </div>
              <Code
                className="h-dvh max-h-64"
                code={JSON.stringify(apiBodyContent, null, 2)}
                lang={JsonLanguage}
                onCopied={() =>
                  toast({
                    title: t('pciDatabasesAddCommandCodeCopied'),
                  })
                }
              ></Code>
              <p>{t('pciDatabasesAddCommandParametersInfo')}</p>
              <Table>
                <TableBody>
                  {Object.entries(apiSchemaDescription).map(
                    ([key, value], index) => (
                      <TableRow key={`infos-row-${index}`}>
                        <TableCell key={`infos-key-${index}`}>{key}</TableCell>
                        <TableCell key={`infos-value-${index}`}>
                          {value}
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="terraform" className="space-y-4">
              <p>{t('pciDatabasesAddCommandDialogTerraformDescription')}</p>
              <Trans
                t={t}
                i18nKey={'pciDatabasesAddCommandDialogDocumentationCta'}
                components={{
                  anchor: (
                    <A
                      target="_blank"
                      href={getDocumentationUrl(
                        LINKS.DB_ORDER_EQ_TERRAFORM,
                        locale,
                      )}
                    ></A>
                  ),
                }}
              ></Trans>
              <br />
              {!terraformData ? (
                <Skeleton
                  className="h-dvh max-h-64 w-full rounded-xl"
                  data-testid="loading-skeleton"
                />
              ) : (
                <Code
                  className="h-dvh max-h-64"
                  code={terraformData}
                  lang={TerraformLanguage}
                  onCopied={() =>
                    toast({
                      title: t('pciDatabasesAddCommandCodeCopied'),
                    })
                  }
                ></Code>
              )}
              <p>{t('pciDatabasesAddCommandParametersInfo')}</p>
              <Table>
                <TableBody>
                  {Object.entries(terraformSchemaDescription).map(
                    ([key, value], index) => (
                      <TableRow key={`infos-row-${index}`}>
                        <TableCell key={`infos-key-${index}`}>{key}</TableCell>
                        <TableCell key={`infos-value-${index}`}>
                          {value}
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
          <Button
            onClick={onRequestClose}
            data-testid="dialog-close-button-footer"
          >
            {t('pciDatabasesAddCommandDialogClose')}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApiTerraformDialog;
