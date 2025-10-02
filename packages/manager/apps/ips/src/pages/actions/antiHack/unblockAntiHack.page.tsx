import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Modal,
  useNotifications,
  useFormatDate,
} from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { ApiError } from '@ovh-ux/manager-core-api';
import { unblockAntiHackIp, getIpAntihackQueryKey, IpAntihackStateEnum } from '@/data/api';
import { useGetIpAntihack } from '@/data/hooks/ip';
import { fromIdToIp, ipFormatter } from '@/utils';


const DEFAULT_LOG_DISPLAY_CLASS_NAMES = 'whitespace-pre overflow-scroll bg-stone-200 p-2 rounded-md border-1 border-solid border-stone-300  min-w-full max-h-48'

export default function AntiHackModal() {
  const { t } = useTranslation(['anti-hack', NAMESPACES.ACTIONS, 'error']);
  const [ipBlocked, setIpBlocked] = useState(undefined);
  const [ipState, setIpState] = useState(undefined);
  const [blockedSince, setBlockedSince] = useState(undefined);
  const [time, setTime] = useState(0);
  const [logs, setLogs] = useState('');
  const [logsDisplayClasses, setLogsDisplayClasses] = useState(DEFAULT_LOG_DISPLAY_CLASS_NAMES);
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { id, parentId } = useParams();
  const { ip } = ipFormatter(fromIdToIp(id));
  const { ip: parentIp } = ipFormatter(fromIdToIp(parentId));
  const { addSuccess, addError, clearNotifications } = useNotifications();
  const queryClient = useQueryClient();
  const { trackClick, trackPage } = useOvhTracking();
  const format = useFormatDate();

  const { ipAntihack, isLoading: isIpAntihackLoading } = useGetIpAntihack({
    ip: parentIp,
    enabled: true,
  });

  useEffect(() => {
    if (ipAntihack) {
      const toBeUnblocked = ipAntihack.find((antihack) => 
        antihack.ipBlocked === ip && antihack.state === IpAntihackStateEnum.BLOCKED);
      setIpBlocked(toBeUnblocked?.ipBlocked);
      setIpState(toBeUnblocked?.state);
      setBlockedSince(toBeUnblocked?.blockedSince);
      setTime(toBeUnblocked?.time);
      if(toBeUnblocked?.logs.length){
        setLogs(toBeUnblocked?.logs);
      } else {
        setLogs(t('anti_hack_no_log_available'));
        setLogsDisplayClasses(`${DEFAULT_LOG_DISPLAY_CLASS_NAMES} text-center`)
      }
    }
  }, [ipAntihack]);

  const closeModal = () => {
    navigate(`..?${search.toString()}`);
  };

  const fields = useMemo(
    () =>
      !!ipState && !!blockedSince
        ? [
            {
              label: t('anti_hack_status'),
              value: ipState,
              key: 'antihack_ipState',
            },
            {
              label: t('anti_hack_blocked_since'),
              value: format({ date: new Date(blockedSince), format: 'PPPpp' }),
              key: 'antihack_blockedSince',
            },
            {
              label: t('anti_hack_time'),
              value: time,
              key: 'antihack_time',
            },
          ]
        : [],
    [ipState, blockedSince, time],
  );

  const { isPending, mutate: unblockAntihackHandler } = useMutation({
    mutationFn: () => unblockAntiHackIp({ ip, ipBlocked }),
    onSuccess: async () => {
      clearNotifications();
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'anti-hack-unblock_success',
      });
      addSuccess(t('unblock_anti_hack_ip_success', { ipBlocked }));

      await queryClient.invalidateQueries({
        queryKey: getIpAntihackQueryKey({ ip }),
      });
      closeModal();
    },
    onError: (err: ApiError) => {
      clearNotifications();
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'anti-hack-unblock_error',
      });
      closeModal();
      addError(
        t('unblock_anti_hack_ip_error', {
          ipBlocked,
          error: err?.response?.data?.message,
        }),
        true,
      );
    },
  });

  const closeHandler = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'exit',
      actions: ['anti-hack-unblock', 'cancel'],
    });
    closeModal();
  };

  return (
    <Modal
      isOpen
      onDismiss={closeHandler}
      heading={t('unblock_anti_hack_title')}
      primaryLabel={t('unblock_anti_hack_ip_action')}
      onPrimaryButtonClick={() => unblockAntihackHandler()}
      isPrimaryButtonLoading={isPending}
      secondaryLabel={t('close', { ns: NAMESPACES.ACTIONS })}
      onSecondaryButtonClick={closeHandler}
      isLoading={isIpAntihackLoading}
    >
      <div className="flex flex-col w-full">
        {fields.map(({ label, value, key }) => (
          <div className="flex mb-2 gap-x-4" key={key}>
            <OdsText
              className="font-semibold text-right w-1/2"
              preset={ODS_TEXT_PRESET.heading6}
            >
              {label}
            </OdsText>
            <OdsText className="w-1/2">{value}</OdsText>
          </div>
        ))}
        <div className="flex mb-2">
          <OdsText
            className={logsDisplayClasses}
            preset="code"
          >
            {logs}
          </OdsText>
        </div>
      </div>
    </Modal>
  );
}
