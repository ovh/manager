import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Link,
  Select,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { useQuery } from '@tanstack/react-query';
import {
  ErrorCircleIcon,
  WarningCircleIcon,
  Tile,
} from '@ovh-ux/manager-themes';
import useDedicatedServerTasks from '@/hooks/useDedicatedServerTasks';
import {
  getDedicatedServer,
  getDedicatedServerGetIpmiFeature,
} from '@/api/dedicatedServer';
import { useEnvironment } from '@/core';

export const IPMI_GUIDES: Record<string, string> = {
  CZ: 'https://docs.ovh.com/cz/cs/dedicated/pouziti-ipmi-dedikovane-servery/',
  DE: 'https://docs.ovh.com/de/dedicated/verwendung-ipmi-dedicated-server/',
  ES: 'https://docs.ovh.com/es/dedicated/utilizar-ipmi-servidor-dedicado/',
  FI:
    'https://docs.ovh.com/fi/dedicated/ipmi-konsolin-kaytto-dedikoidut-palvelimet/',
  FR: 'https://docs.ovh.com/fr/dedicated/utilisation-ipmi-serveurs-dedies/',
  QC: 'https://docs.ovh.com/fr/dedicated/utilisation-ipmi-serveurs-dedies/',
  IT: 'https://docs.ovh.com/it/dedicated/utilizzo-ipmi-server-dedicati/',
  LT: 'https://docs.ovh.com/lt/dedicated/use-ipmi-dedicated-servers/',
  NL: 'https://docs.ovh.com/nl/dedicated/gebruik-ipmi-dedicated-servers/',
  PL: 'https://docs.ovh.com/pl/dedicated/uzywanie-ipmi-serwery-dedykowane/',
  PT: 'https://docs.ovh.com/pt/dedicated/usar-ipmi-servidores-dedicados/',
  IE: 'https://docs.ovh.com/ie/en/dedicated/use-ipmi-dedicated-servers/',
  US:
    'https://docs.ovh.com/gb/en/dedicated/use-ipmi-dedicated-servers/#testing-and-rebooting-the-ipmi',
  DEFAULT: 'https://docs.ovh.com/gb/en/dedicated/use-ipmi-dedicated-servers/',
};

export default function NodeIpmiPage(): JSX.Element {
  const { t } = useTranslation('node-ipmi');
  const navigate = useNavigate();
  const environment = useEnvironment();
  const { nodeId } = useParams();
  const guideURL =
    IPMI_GUIDES[environment.getUser().ovhSubsidiary] || IPMI_GUIDES.DEFAULT;

  const { data: ipmi, isLoading: isIpmiLoading } = useQuery(
    ['dedicated_server_ipmi', nodeId],
    () => getDedicatedServerGetIpmiFeature(nodeId),
  );

  const { pendingTasks, isPendingTasksLoading } = useDedicatedServerTasks(
    nodeId,
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
      {canConfigureIpmi && (
        <Box m={4}>
          <SimpleGrid
            columns={{ sm: 1, md: 2, lg: 3 }}
            spacingX={5}
            spacingY={3}
          >
            <Tile>
              <h5>{t('kvm_title')}</h5>
              <Text mt={4}>{t('kvm_info')}</Text>
              <Divider my={2} />
              <Button variant="secondary" w="100%">
                {t('kvm_browser')}
              </Button>
              <Divider my={2} />
              <Button variant="secondary" w="100%">
                {t('kvm_applet')}
              </Button>
            </Tile>
            <Tile>
              <h5>{t('ipmi_sol_title')}</h5>
              <Text mt={4}>{t('ipmi_sol_info')}</Text>
              <Divider my={2} />
              <Button variant="secondary" w="100%">
                {t('ipmi_sol_browser')}
              </Button>
              <Divider my={2} />
              <FormControl>
                <FormLabel>{t('ipmi_sol_ssh')}</FormLabel>
                <Select
                  value={'b'}
                  onChange={(e) => console.log(e.target.value)}
                >
                  <option key={'a'} value={'b'}>
                    test
                  </option>
                </Select>
              </FormControl>
            </Tile>
            <Box>
              <Button
                variant="secondary"
                w="100%"
                onClick={() => navigate('./restart')}
              >
                {t('ipmi_restart')}
              </Button>
              <Button variant="secondary" w="100%" mt={2}>
                {t('ipmi_test')}
              </Button>
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
