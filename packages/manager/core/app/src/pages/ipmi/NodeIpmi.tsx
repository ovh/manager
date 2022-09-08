import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Link,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { useQuery } from '@tanstack/react-query';
import {
  ErrorCircleIcon,
  WarningCircleIcon,
  SuccessCircleIcon,
  Tile,
} from '@ovh-ux/manager-themes';
import { FilterComparator } from '@/api/filters';
import {
  getDedicatedServer,
  getDedicatedServerGetIpmiFeature,
  getDedicatedServerTasks,
  IpmiAccessType,
} from '@/api/dedicatedServer';
import { useEnvironment } from '@/core';
import NodeIpmiTest from './NodeIpmiTest';
import { IPMI_GUIDES } from './nodeIpmi.constants';

const NodeIpmiKvm = React.lazy(() => import('./NodeIpmiKvm'));
const NodeIpmiSol = React.lazy(() => import('./NodeIpmiSol'));

export default function NodeIpmiPage(): JSX.Element {
  const { t } = useTranslation('node-ipmi');
  const navigate = useNavigate();
  const environment = useEnvironment();
  const { nodeId } = useParams();
  const [testIpmi, setTestIpmi] = useState(false);
  const [accessReady, setAccessReady] = useState(false);
  const [accessRequest, setAccessRequest] = useState<IpmiAccessType>();
  const guideURL =
    IPMI_GUIDES[environment.getUser().ovhSubsidiary] || IPMI_GUIDES.DEFAULT;

  const { data: ipmi, isLoading: isIpmiLoading } = useQuery(
    ['dedicated_server_ipmi', nodeId],
    () => getDedicatedServerGetIpmiFeature(nodeId),
  );

  const { data: pendingTasks, isLoading: isPendingTasksLoading } = useQuery(
    ['dedicated_server_tasks', nodeId],
    async () => {
      const { data } = await getDedicatedServerTasks(nodeId, {
        filters: [
          {
            key: 'status',
            value: ['todo', 'init', 'doing'],
            comparator: FilterComparator.IsIn,
          },
        ],
      });
      return data;
    },
    {
      staleTime: 5 * 60 * 1000,
      refetchInterval: 30 * 1000,
      refetchOnWindowFocus: 'always',
    },
  );

  const { data: server, isLoading: isServerLoading } = useQuery(
    ['server', nodeId],
    () => getDedicatedServer(nodeId, true),
  );

  const isLoading = isIpmiLoading || isPendingTasksLoading || isServerLoading;

  if (isLoading) {
    return undefined;
  }

  const blockingTasks = pendingTasks.filter((task) =>
    ['hardReboot', 'resetIPMI', 'resetIPMISession'].includes(task.function),
  );

  const canConfigureIpmi =
    ipmi.activated && server.state === 'ok' && blockingTasks.length === 0;

  const hasSOL =
    environment.getRegion() !== 'US' &&
    (ipmi.supportedFeatures.serialOverLanURL ||
      ipmi.supportedFeatures.serialOverLanSshKey);

  return (
    <>
      <Outlet />
      {server.state !== 'ok' && (
        <Alert status="error">
          <AlertIcon as={ErrorCircleIcon} />
          <Text>
            <Trans
              ns="node-ipmi"
              i18nKey="impi_server_disabled"
              t={t}
              values={{ state: t(`ipmi_server_state_${server.state}`) }}
              components={{
                bold: <b />,
              }}
            />
          </Text>
        </Alert>
      )}
      {blockingTasks.length > 0 && (
        <Alert status="warning">
          <AlertIcon as={WarningCircleIcon} />
          <Text>{t('ipmi_pending_task')}</Text>
        </Alert>
      )}
      {accessReady && (
        <Alert status="success">
          <AlertIcon as={SuccessCircleIcon} />
          <Text>{t('ipmi_browser_access_ready')}</Text>
        </Alert>
      )}
      {canConfigureIpmi && (
        <Box m={4}>
          <SimpleGrid
            columns={{ sm: 1, md: 2, lg: 3 }}
            spacingX={5}
            spacingY={3}
          >
            <Tile>
              <NodeIpmiKvm
                disabled={!!accessRequest}
                serviceName={nodeId}
                onAccessReady={() => setAccessReady(true)}
                onAccessRequest={setAccessRequest}
              />
            </Tile>
            {hasSOL && (
              <Tile>
                <NodeIpmiSol
                  serviceName={nodeId}
                  disabled={!!accessRequest}
                  onAccessReady={() => setAccessReady(true)}
                  onAccessRequest={setAccessRequest}
                  serialOverLanURL={ipmi.supportedFeatures.serialOverLanURL}
                  serialOverLanSshKey={
                    ipmi.supportedFeatures.serialOverLanSshKey
                  }
                />
              </Tile>
            )}
            <Box>
              <Button
                variant="secondary"
                w="100%"
                mb={2}
                onClick={() => navigate('./restart')}
              >
                {t('ipmi_restart')}
              </Button>
              <Button
                variant="secondary"
                w="100%"
                mb={4}
                disabled={testIpmi}
                onClick={() => setTestIpmi(true)}
              >
                {t('ipmi_test')}
              </Button>
              <NodeIpmiTest
                serviceName={nodeId}
                testing={testIpmi}
                onTestingDone={() => setTestIpmi(false)}
              />
            </Box>
          </SimpleGrid>
          <Text mt={4}>{t('ipmi_info_1')}</Text>
          <Text mt={4}>
            {t('ipmi_info_2')}
            <Link href={guideURL} isExternal ml={2}>
              {t('ipmi_guide_link')}
              <ExternalLinkIcon ml={2} />
            </Link>
          </Text>
        </Box>
      )}
    </>
  );
}
