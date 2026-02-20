/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  BUTTON_VARIANT,
  Button,
  CheckboxGroup,
  DRAWER_POSITION,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerTrigger,
  Link,
  Message,
  MessageBody,
  MessageIcon,
  RadioGroup,
  SPINNER_SIZE,
  Spinner,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/muk';

import { useVrackTasksContext } from '@/contexts/vrack-tasks/useVrackTasks';
import { getGetEligibleServicesKey, useGetEligibleServices } from '@/hooks/useGetEligibleServices';
import { useAttachIpv4ToVrack } from '@/hooks/vrack-ip/ipv4/useAttachIpv4ToVrack';
import { getVrackIpv4ListKey } from '@/hooks/vrack-ip/ipv4/useGetVrackIpv4List';
import { useAttachIpv6ToVrack } from '@/hooks/vrack-ip/ipv6/useAttachIpv6ToVrack';
import { getVrackIpv6ListKey } from '@/hooks/vrack-ip/ipv6/useGetVrackIpv6List';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

import { IpBlockCardIpv4 } from './IpBlockCardIpv4';
import { IpBlockCardIpv6 } from './IpBlockCardIpv6';

export const AttachIpBlockDrawer = ({
  serviceName,
  region,
}: {
  serviceName: string;
  region: string;
}) => {
  const { t } = useTranslation([TRANSLATION_NAMESPACES.publicIpRouting, NAMESPACES.ACTIONS]);
  const { trackTask } = useVrackTasksContext();
  const queryClient = useQueryClient();
  const { addInfo, addSuccess, addError, clearNotifications } = useNotifications();
  const [selectedIpv4List, setSelectedIpv4List] = useState<string[]>([]);
  const [pendingIps, setPendingIps] = useState<string[]>([]);
  const [errorIps, setErrorIps] = useState<string[]>([]);
  const [disabledIps, setDisabledIps] = useState<string[]>([]);
  const [selectedIpv6, setSelectedIpv6] = useState<string | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [isWaitingForFreshData, setIsWaitingForFreshData] = useState(false);
  const { ipv4List, ipv6List, isComplete, isLoading, isFetching } = useGetEligibleServices(
    serviceName,
    region,
  );

  useEffect(() => {
    if (isWaitingForFreshData && !isFetching) {
      setIsWaitingForFreshData(false);
    }
  }, [isFetching, isWaitingForFreshData]);

  const addToPendingIps = (pendingIpsToAdd: string[]) => {
    setPendingIps([...pendingIps, ...pendingIpsToAdd]);
    setDisabledIps([...disabledIps, ...pendingIpsToAdd]);
    setSelectedIpv4List(selectedIpv4List.filter((ip) => !pendingIpsToAdd.includes(ip)));

    if (selectedIpv6 !== undefined && pendingIpsToAdd.includes(selectedIpv6)) {
      setSelectedIpv6(undefined);
    }
  };

  const addToErrorIps = (errorIp: string) => {
    setErrorIps([...errorIps, errorIp]);
    setDisabledIps([...disabledIps, errorIp]);
    setPendingIps(pendingIps.filter((ip) => ip !== errorIp));
  };

  const { mutate: attachIpv4, isPending: isPendingAttachIpv4 } = useAttachIpv4ToVrack({
    serviceName,
    onSuccess: (taskId: number, ip: string) => {
      clearNotifications();
      addInfo(<Text>{t('publicIpRouting_region_attach_additional_ip_pending')}</Text>);
      trackTask({
        taskId,
        resourceId: ip,
        region,
        operationType: 'addBlockToBridgeDomain',
        onFinished: () => {
          clearNotifications();
          addSuccess(<Text>{t('publicIpRouting_region_attach_additional_ip_success')}</Text>);
          void queryClient.invalidateQueries({ queryKey: getVrackIpv4ListKey(serviceName) });
          void queryClient.invalidateQueries({ queryKey: getGetEligibleServicesKey(serviceName) });
        },
      });
    },
    onError: (error: ApiError, ip: string) => {
      clearNotifications();
      addError(
        <Text>
          {t('publicIpRouting_region_attach_additional_ip_error', { apiError: error.message })}
        </Text>,
      );
      addToErrorIps(ip);
    },
  });

  const { mutate: attachIpv6, isPending: isPendingAttachIpv6 } = useAttachIpv6ToVrack({
    serviceName,
    onSuccess: (taskId: number, ip: string) => {
      clearNotifications();
      addInfo(<Text>{t('publicIpRouting_region_attach_additional_ip_pending')}</Text>);
      trackTask({
        taskId,
        resourceId: ip,
        region,
        operationType: 'addBlockV6ToBridgeDomain',
        onFinished: () => {
          clearNotifications();
          addSuccess(<Text>{t('publicIpRouting_region_attach_additional_ip_success')}</Text>);
          void queryClient.invalidateQueries({ queryKey: getVrackIpv6ListKey(serviceName) });
          void queryClient.invalidateQueries({ queryKey: getGetEligibleServicesKey(serviceName) });
        },
      });
    },
    onError: (error: ApiError, ip: string) => {
      clearNotifications();
      addError(
        <Text>
          {t('publicIpRouting_region_attach_additional_ip_error', { apiError: error.message })}
        </Text>,
      );
      addToErrorIps(ip);
    },
  });

  const switchIpv4Selection = (selectedIp: string) => {
    if (!disabledIps.includes(selectedIp)) {
      setSelectedIpv4List(
        !selectedIpv4List.includes(selectedIp)
          ? [...selectedIpv4List, selectedIp]
          : selectedIpv4List.filter((ip) => ip !== selectedIp),
      );
    }
  };

  const switchIpv6Selection = (selectedIp: string) => {
    if (!disabledIps.includes(selectedIp)) {
      setSelectedIpv6(selectedIpv6 !== selectedIp ? selectedIp : undefined);
    }
  };

  const attachIpBlocks = () => {
    selectedIpv4List.forEach((ip) => {
      attachIpv4({ ip, region });
    });

    if (selectedIpv6) {
      attachIpv6(selectedIpv6);
    }

    const pendingIpsToAdd = selectedIpv6
      ? [...selectedIpv4List, selectedIpv6]
      : [...selectedIpv4List];
    addToPendingIps(pendingIpsToAdd);
  };

  const hasEligibleIps = ipv4List.length > 0 || ipv6List.length > 0;
  const shouldDisplayMainSpinner =
    isLoading || isWaitingForFreshData || (!isComplete && !hasEligibleIps);
  const shouldDisplayIpList = !isLoading && !isWaitingForFreshData && hasEligibleIps;
  const shouldDisplayNoIpFoundList =
    !isLoading && !isWaitingForFreshData && isComplete && !hasEligibleIps;
  const shoudlDisplaySecondarySpinner = !isLoading && hasEligibleIps && !isComplete;

  return (
    <Drawer
      open={isOpen}
      closeOnInteractOutside
      closeOnEscape
      onOpenChange={(e) => {
        setIsOpen(e.open);
        setSelectedIpv4List([]);
        setSelectedIpv6(undefined);
        if (e.open) {
          setIsWaitingForFreshData(true);
          if (isComplete) {
            void queryClient.invalidateQueries({
              queryKey: getGetEligibleServicesKey(serviceName),
            });
          }
        } else {
          setIsWaitingForFreshData(false);
        }
      }}
    >
      <DrawerTrigger asChild>
        <Link className="my-4 flex items-center">
          {t('publicIpRouting_region_attach_additional_ip_link')}
        </Link>
      </DrawerTrigger>
      <DrawerContent position={DRAWER_POSITION.right}>
        <DrawerBody className="flex h-[96%] flex-col">
          <div>
            <Text preset={TEXT_PRESET.heading4} className="mb-10">
              {t('publicIpRouting_region_attach_additional_ip_title', { region })}
            </Text>
            <Text preset={TEXT_PRESET.small} className="mb-4">
              {t('publicIpRouting_region_attach_additional_ip_description')}
            </Text>

            <Message dismissible={false} className="mb-12">
              <MessageIcon name="circle-info" />
              <MessageBody>
                <Text preset={TEXT_PRESET.small}>
                  {t('publicIpRouting_region_attach_additional_ip_ipv6_note')}
                </Text>
              </MessageBody>
            </Message>

            {shouldDisplayMainSpinner && (
              <div className="flex w-full justify-center">
                <Spinner size={SPINNER_SIZE.lg} />
              </div>
            )}
            {shouldDisplayNoIpFoundList && (
              <Text preset={TEXT_PRESET.paragraph} className="flex w-full justify-center">
                {t('publicIpRouting_region_attach_additional_ip_no_ip_found')}
              </Text>
            )}
            {shouldDisplayIpList && (
              <div className="h-56 overflow-auto">
                <CheckboxGroup value={selectedIpv4List}>
                  {ipv4List.map(({ ip, description }) => (
                    <IpBlockCardIpv4
                      key={ip}
                      ip={ip}
                      description={description}
                      isSelected={selectedIpv4List.includes(ip)}
                      isDisabled={disabledIps.includes(ip)}
                      isPending={pendingIps.includes(ip)}
                      isError={errorIps.includes(ip)}
                      onSelect={() => switchIpv4Selection(ip)}
                    />
                  ))}
                </CheckboxGroup>
                <RadioGroup value={selectedIpv6}>
                  {ipv6List.map(({ ip, description }) => (
                    <IpBlockCardIpv6
                      key={ip}
                      ip={ip}
                      description={description}
                      isSelected={selectedIpv6 === ip}
                      isDisabled={disabledIps.includes(ip)}
                      isPending={pendingIps.includes(ip)}
                      isError={errorIps.includes(ip)}
                      onSelect={() => switchIpv6Selection(ip)}
                    />
                  ))}
                </RadioGroup>
                {shoudlDisplaySecondarySpinner && (
                  <div className="mt-8 flex w-full justify-center">
                    <Spinner size={SPINNER_SIZE.sm} />
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="mt-auto flex gap-4">
            <Button variant={BUTTON_VARIANT.ghost} onClick={() => setIsOpen(false)}>
              {t('cancel', { ns: NAMESPACES.ACTIONS })}
            </Button>
            <Button
              disabled={!selectedIpv4List.length && !selectedIpv6}
              loading={isPendingAttachIpv4 || isPendingAttachIpv6}
              onClick={attachIpBlocks}
            >
              {t('publicIpRouting_region_attach_additional_ip_cta')}
            </Button>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
