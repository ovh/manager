import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, HStack, Spinner, Text } from '@chakra-ui/react';
import { CheckIcon, WarningIcon } from '@chakra-ui/icons';
import { useQuery } from '@tanstack/react-query';
import { FilterComparator } from '@/api/filters';
import {
  dedicatedServerIpmiTest,
  DedicatedServerTask,
  getDedicatedServerTasks,
} from '@/api/dedicatedServer';
import { PENDING_STATUS } from './nodeIpmi.constants';

type NodeIpmiTestProps = {
  serviceName: string;
  testing: boolean;
  onTestingDone: () => void;
};

function getTaskIcon(task?: DedicatedServerTask): JSX.Element {
  switch (task?.status) {
    case 'init':
    case 'todo':
    case 'doing':
      return <Spinner size="sm" />;
    case 'done':
      return <CheckIcon />;
    default:
      return <WarningIcon />;
  }
}

export default function NodeIpmiTest({
  serviceName,
  testing,
  onTestingDone,
}: NodeIpmiTestProps): JSX.Element {
  const [testingTasks, setTestingTasks] = useState<DedicatedServerTask[]>([]);
  const { t } = useTranslation('node-ipmi');

  useQuery(
    ['dedicated_server_test_ipmi_http_task', serviceName],
    () =>
      getDedicatedServerTasks(serviceName, {
        filters: [
          {
            key: 'taskId',
            value: testingTasks.map(({ taskId }) => `${taskId}`),
            comparator: FilterComparator.IsIn,
          },
        ],
      }),
    {
      staleTime: Infinity,
      refetchInterval: () => {
        const isPending = testingTasks.some(({ status }) =>
          PENDING_STATUS.includes(status),
        );
        return isPending ? 5 * 1000 : false;
      },
      enabled: testingTasks.length > 0,
      onSuccess: ({ data }) => {
        setTestingTasks((tasks) =>
          tasks.map((task) => ({
            ...task,
            ...data.find(({ taskId }) => taskId === task.taskId),
          })),
        );
      },
    },
  );

  useEffect(() => {
    if (testing) {
      dedicatedServerIpmiTest(serviceName, 5, 'http').then((task) => {
        setTestingTasks([task]);
      });
    }
  }, [testing]);

  useEffect(() => {
    const httpDone = testingTasks.some(
      (task) =>
        task.function === 'testIPMIhttp' &&
        !PENDING_STATUS.includes(task.status),
    );
    const passwordDone = testingTasks.some(
      (task) =>
        task.function === 'testIPMIpassword' &&
        !PENDING_STATUS.includes(task.status),
    );
    const pingDone = testingTasks.some(
      (task) =>
        task.function === 'testIPMIping' &&
        !PENDING_STATUS.includes(task.status),
    );
    if (httpDone) {
      if (!testingTasks.some((task) => task.function === 'testIPMIpassword')) {
        dedicatedServerIpmiTest(serviceName, 5, 'password').then((task) => {
          setTestingTasks((taskList) => [task, ...taskList]);
        });
      }
    }
    if (passwordDone) {
      if (!testingTasks.some((task) => task.function === 'testIPMIping')) {
        dedicatedServerIpmiTest(serviceName, 5, 'ping').then((task) => {
          setTestingTasks((taskList) => [task, ...taskList]);
        });
      }
    }
    if (pingDone) {
      onTestingDone();
    }
  }, [JSON.stringify(testingTasks)]);

  const testingHttp = testingTasks.find(
    (task) => task.function === 'testIPMIhttp',
  );

  const testingPassword = testingTasks.find(
    (task) => task.function === 'testIPMIpassword',
  );

  const testingPing = testingTasks.find(
    (task) => task.function === 'testIPMIping',
  );

  return (
    <Box>
      {testingHttp && (
        <HStack>
          {getTaskIcon(testingHttp)}
          <Text>{t('ipmi_test_http')}</Text>
        </HStack>
      )}
      {testingPassword && (
        <HStack>
          {getTaskIcon(testingPassword)}
          <Text>{t('ipmi_test_password')}</Text>
        </HStack>
      )}
      {testingPing && (
        <HStack>
          {getTaskIcon(testingPing)}
          <Text>{t('ipmi_test_ping')}</Text>
        </HStack>
      )}
    </Box>
  );
}
