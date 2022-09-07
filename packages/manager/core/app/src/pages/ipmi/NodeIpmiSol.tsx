import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Link,
  Select,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { getSshKeys } from '@/api/me';
import { FilterComparator } from '@/api/filters';
import {
  dedicatedServerIpmiAccess,
  DedicatedServerTask,
  getDedicatedServerIpmiAccess,
  getDedicatedServerTasks,
} from '@/api/dedicatedServer';
import { PENDING_STATUS } from './nodeIpmi.constants';

type NodeIpmiSolProps = {
  serviceName: string;
  onAccessReady: () => void;
  serialOverLanURL: boolean;
  serialOverLanSshKey: boolean;
};

export default function NodeIpmiSol({
  serviceName,
  onAccessReady,
  serialOverLanURL,
  serialOverLanSshKey,
}: NodeIpmiSolProps): JSX.Element {
  const { t } = useTranslation('node-ipmi');
  const [accessTask, setAccessTask] = useState<DedicatedServerTask>();
  const [accessRequest, setAccessRequest] = useState<
    'serialOverLanURL' | 'serialOverLanSshKey'
  >();
  const [accessURL, setAccessURL] = useState<string>();
  const [accessHost, setAccessHost] = useState<string>();
  const [selectedSshKey, setSelectedSshKey] = useState<string>();

  const { data: sshKeys } = useQuery(['ssh_keys'], getSshKeys, {
    staleTime: 5 * 60 * 1000,
    enabled: serialOverLanSshKey,
  });

  useQuery(
    ['dedicated_server_test_ipmi_http_task', serviceName],
    () =>
      getDedicatedServerTasks(serviceName, {
        filters: [
          {
            key: 'taskId',
            value: `${accessTask.taskId}`,
            comparator: FilterComparator.IsEqual,
          },
        ],
      }),
    {
      staleTime: Infinity,
      refetchInterval: () => {
        const isPending = PENDING_STATUS.includes(accessTask?.status);
        return isPending ? 5 * 1000 : false;
      },
      enabled: !!accessTask,
      onSuccess: ({ data }) => {
        setAccessTask({
          ...accessTask,
          ...data[0],
        });
      },
    },
  );

  useEffect(() => {
    if (accessTask?.status === 'done') {
      getDedicatedServerIpmiAccess(serviceName, accessRequest).then(
        ({ value }) => {
          if (accessRequest === 'serialOverLanURL') {
            setAccessURL(value);
          } else if (accessRequest === 'serialOverLanSshKey') {
            setAccessHost(value);
          }
          setAccessRequest(undefined);
          onAccessReady();
        },
      );
    }
  }, [accessTask]);

  useEffect(() => {
    if (accessRequest) {
      dedicatedServerIpmiAccess(
        serviceName,
        5,
        accessRequest,
        selectedSshKey,
      ).then((task) => {
        setAccessTask(task);
      });
    }
  }, [accessRequest]);

  useEffect(() => {
    if (selectedSshKey) {
      setAccessRequest('serialOverLanSshKey');
    }
  }, [selectedSshKey]);

  return (
    <>
      <h5>{t('ipmi_sol_title')}</h5>
      <Text mt={4}>{t('ipmi_sol_info')}</Text>
      <Divider my={2} />
      {serialOverLanURL && (
        <>
          <Button
            variant="secondary"
            w="100%"
            disabled={!!accessRequest}
            onClick={() => {
              setAccessRequest('serialOverLanURL');
            }}
          >
            {PENDING_STATUS.includes(accessTask?.status) &&
              accessRequest === 'serialOverLanURL' && (
                <Spinner size="sm" mr={4} />
              )}
            {t('ipmi_sol_browser')}
          </Button>
          {accessURL && (
            <Button
              as={Link}
              variant="secondary"
              mt={2}
              w="100%"
              href={accessURL}
              isExternal={true}
            >
              {t('ipmi_sol_console')}
            </Button>
          )}
          <Divider my={2} />
        </>
      )}
      {sshKeys?.length && (
        <FormControl>
          <FormLabel>{t('ipmi_sol_ssh')}</FormLabel>
          <Select
            value={selectedSshKey}
            onChange={(e) => setSelectedSshKey(e.target.value)}
            disabled={!!accessRequest}
            placeholder={t('ipmi_ssh_select')}
          >
            {sshKeys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </Select>
          {PENDING_STATUS.includes(accessTask?.status) &&
            accessRequest === 'serialOverLanSshKey' && (
              <Spinner size="sm" mt={4} />
            )}
          {accessHost && <Input value={accessHost} isReadOnly mt={2} />}
        </FormControl>
      )}
    </>
  );
}
