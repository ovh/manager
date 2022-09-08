import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Button, Divider, Link, Spinner, Text } from '@chakra-ui/react';
import { getGeolocation } from '@/api/me';
import { FilterComparator } from '@/api/filters';
import {
  dedicatedServerIpmiAccess,
  DedicatedServerTask,
  getDedicatedServerIpmiAccess,
  getDedicatedServerTasks,
  IpmiAccessType,
} from '@/api/dedicatedServer';
import { PENDING_STATUS } from './nodeIpmi.constants';

type NodeIpmiSolProps = {
  serviceName: string;
  disabled?: boolean;
  onAccessReady: () => void;
  onAccessRequest: (type: IpmiAccessType) => void;
};

export default function NodeIpmiSol({
  serviceName,
  disabled,
  onAccessReady,
  onAccessRequest,
}: NodeIpmiSolProps): JSX.Element {
  const { t } = useTranslation('node-ipmi');
  const [accessTask, setAccessTask] = useState<DedicatedServerTask>();
  const [accessRequest, setAccessRequest] = useState<IpmiAccessType>();
  const [accessURL, setAccessURL] = useState<string>();
  const [applet, setApplet] = useState<string>();

  useQuery(
    ['dedicated_server_test_kvm_http_task', serviceName],
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
          if (accessRequest === 'kvmipHtml5URL') {
            setAccessURL(value);
          } else if (accessRequest === 'kvmipJnlp') {
            const fileName = `${serviceName.replace(/\./g, '-')}|.jnlp`;
            const blob = new Blob([value], {
              type: 'application/x-java-jnlp-file',
            });
            const link = document.createElement('a');
            if (link.download !== undefined) {
              const url = window.URL.createObjectURL(blob);
              link.setAttribute('href', url);
              link.setAttribute('download', fileName);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } else {
              setApplet(encodeURIComponent(value));
            }
          }
          setAccessRequest(undefined);
          onAccessReady();
        },
      );
    }
  }, [accessTask]);

  useEffect(() => {
    if (accessRequest) {
      getGeolocation().then(({ ip }) => {
        dedicatedServerIpmiAccess(
          serviceName,
          5,
          accessRequest,
          undefined,
          ip,
        ).then((task) => {
          setAccessTask(task);
        });
      });
    }
  }, [accessRequest]);

  useEffect(() => {
    onAccessRequest(accessRequest);
  }, [accessRequest]);

  return (
    <>
      <h5>{t('kvm_title')}</h5>
      <Text mt={4}>{t('kvm_info')}</Text>
      <Divider my={2} />
      <Button
        variant="secondary"
        w="100%"
        disabled={disabled || !!accessRequest}
        onClick={() => {
          setAccessRequest('kvmipHtml5URL');
        }}
      >
        {PENDING_STATUS.includes(accessTask?.status) &&
          accessRequest === 'kvmipHtml5URL' && <Spinner size="sm" mr={4} />}
        {t('kvm_browser')}
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
          {t('ipmi_kvm_console')}
        </Button>
      )}
      <Divider my={2} />
      <Button
        variant="secondary"
        w="100%"
        disabled={disabled || !!accessRequest}
        onClick={() => {
          setAccessRequest('kvmipJnlp');
        }}
      >
        {PENDING_STATUS.includes(accessTask?.status) &&
          accessRequest === 'kvmipJnlp' && <Spinner size="sm" mr={4} />}
        {t('kvm_applet')}
      </Button>
      {applet && (
        <Button
          as={Link}
          variant="secondary"
          mt={2}
          w="100%"
          href={`data:application/x-java-jnlp-file,${applet}`}
          isExternal={true}
        >
          {t('ipmi_kvm_applet_download')}
        </Button>
      )}
    </>
  );
}
