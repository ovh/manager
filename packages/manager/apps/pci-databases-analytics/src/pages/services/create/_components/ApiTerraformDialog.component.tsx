import { Trans, useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
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
import { ServiceCreationWithEngine } from '@/hooks/api/database/service/useAddService.hook';
import { useLocale } from '@/hooks/useLocale';

import * as TTerraform from '@/types/terraform';
import * as database from '@/types/cloud/project/database';
import { Disk } from '@/types/cloud/project/database/service/Disk';
import { LINKS, getDocumentationUrl } from '@/configuration/documentation';

type OrderFunnelResult = ReturnType<typeof useOrderFunnel>['result'];

const ApiTerraformDialog = ({
  onRequestClose,
  dialogData,
}: {
  onRequestClose: () => void;
  dialogData: OrderFunnelResult;
}) => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  const { projectId } = useParams();
  const locale = useLocale();
  const { toast } = useToast();

  // API and Terraform schemas description
  const apiSchemaDescription = {
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
  };
  const terraformSchemaDescription = {
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
  };

  const [
    terraformData,
    setTerraformData,
  ] = useState<TTerraform.cloud.Response | null>(null);
  const { serviceToTerraform } = useServiceToTerraform({
    onError: () => {
      toast({
        title: t('pciDatabasesAddCommandDialogTerraformFetchError'),
        variant: 'destructive',
      });
    },
    onSuccess: (data) => {
      setTerraformData(data);
    },
  });

  type TabType = 'api' | 'terraform';
  const [currentTab, setCurrentTab] = useState<TabType>('api');
  const handleTabChange = async (tab: TabType) => {
    setCurrentTab(tab);
    if (tab === 'terraform' && !terraformData) {
      // Handle Terraform data
      const nodesList: TTerraform.cloud.database.service.Node[] = [];
      // Add nodes to nodesList depending on data.nbNodes
      for (let i = 0; i < dialogData.nodes; i += 1) {
        nodesList.push({
          flavor: dialogData.availability.flavor,
          region: dialogData.availability.region,
        });
      }

      const terraformService: TTerraform.cloud.database.ServiceRequest = {
        body: {
          description: dialogData.name,
          nodesList,
          plan: dialogData.availability.plan,
          version: `${dialogData.availability.version}`,
          ipRestrictions: dialogData.ipRestrictions,
        },
        pathParams: {
          engine: dialogData.availability
            .engine as TTerraform.cloud.database.EngineEnum,
          serviceName: projectId,
        },
      };
      if (dialogData.flavor.storage) {
        terraformService.body.disk = {
          size:
            dialogData.flavor.storage.minimum.value +
            dialogData.additionalStorage,
        } as Disk;
      }
      serviceToTerraform(terraformService);
    }
  };

  // Fill API configuration
  const apiBody: ServiceCreationWithEngine = {
    description: dialogData.name,
    engine: dialogData.availability.engine as database.EngineEnum,
    nodesPattern: {
      flavor: dialogData.availability.flavor,
      number: dialogData.nodes,
      region: dialogData.availability.region,
    },
    plan: dialogData.availability.plan,
    version: dialogData.availability.version,
    ipRestrictions: dialogData.ipRestrictions,
  };
  if (dialogData.network.type === database.NetworkTypeEnum.private) {
    const networkOpenstackId = dialogData.network.network.regions.find((r) =>
      r.region.includes(dialogData.availability.region),
    ).openstackId;
    apiBody.networkId = networkOpenstackId;
    apiBody.subnetId = dialogData.network.subnet.id;
  }
  if (dialogData.flavor.storage) {
    apiBody.disk = {
      size:
        dialogData.flavor.storage.minimum.value + dialogData.additionalStorage,
    } as database.service.Disk;
  }
  // Destructure body to extract engine and keep the rest
  const { engine, ...formattedApiBody } = apiBody;
  const apiEndpoint = `/cloud/project/${projectId}/database/${engine}`;
  const apiBodyContent = formattedApiBody;

  return (
    <>
      <Dialog open={true} onOpenChange={onRequestClose}>
        <DialogContent className="fixed left-1/2 top-1/2 max-h-[80vh] w-[90vw] max-w-xl -translate-x-1/2 -translate-y-1/2 p-4">
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
            <TabsContent
              value="api"
              className="max-h-[60vh] overflow-auto space-y-4"
            >
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
                  className="bg-gray-100 px-2 py-0.5 rounded text-gray-800 break-all"
                  data-testid="dialog-api-endpoint"
                >
                  {apiEndpoint}
                </span>
              </div>
              <Code
                className="h-dvh max-h-64 max-w-full"
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
            <TabsContent
              value="terraform"
              className="max-h-[60vh] overflow-auto space-y-4"
            >
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
              {!terraformData ? (
                <Skeleton
                  className="h-dvh max-h-64 w-full rounded-xl"
                  data-testid="loading-skeleton"
                />
              ) : (
                <Code
                  className="h-dvh max-h-64 max-w-full"
                  code={terraformData.resource}
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
