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
import { unblockAntiHackIp, getIpAntihackQueryKey } from '@/data/api';
import { useGetIpAntihack } from '@/data/hooks/ip';
import { fromIdToIp, ipFormatter } from '@/utils';

export default function AntiHackModal() {
  const { t } = useTranslation(['anti-hack', NAMESPACES.ACTIONS, 'error']);
  const [ipBlocked, setIpBlocked] = useState(undefined);
  const [ipState, setIpState] = useState(undefined);
  const [blockedSince, setBlockedSince] = useState(undefined);
  const [time, setTime] = useState(0);
  const [logs, setLogs] = useState('');
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { id } = useParams();
  const { ip } = ipFormatter(fromIdToIp(id));
  const { addSuccess, addError, clearNotifications } = useNotifications();
  const queryClient = useQueryClient();
  const { trackClick, trackPage } = useOvhTracking();
  const format = useFormatDate();

  const { ipAntihack, isLoading: isIpAntihackLoading } = useGetIpAntihack({
    ip,
    enabled: true,
  });

  useEffect(() => {
    if (ipAntihack) {
      setIpBlocked(ipAntihack[0]?.ipBlocked);
      setIpState(ipAntihack[0]?.state);
      setBlockedSince(ipAntihack[0]?.blockedSince);
      setTime(ipAntihack[0]?.time);
      setLogs(ipAntihack[0]?.logs);
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
              label: t('antiHackStatus'),
              value: ipState,
              key: 'antihack_ipState',
            },
            {
              label: t('antiHackBlockedSince'),
              value: format({ date: new Date(blockedSince), format: 'PPPpp' }),
              key: 'antihack_blockedSince',
            },
            {
              label: t('antiHackTime'),
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
      addSuccess(t('unblockAntiHackIP_success', { ipBlocked }));

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
        t('unblockAntiHackIP_error', {
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
      heading={t('unblockAntiHackTitle')}
      primaryLabel={t('unblockAntiHackIP_action')}
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
            className="whitespace-pre overflow-scroll bg-stone-200 p-2 rounded-md border-1 border-solid border-stone-300 max-h-48"
            preset="code"
          >
            {logs}
          </OdsText>
        </div>
      </div>
    </Modal>
  );
}
