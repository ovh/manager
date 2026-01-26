import React, { useMemo } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { Modal, useFormatDate, useNotifications } from '@ovh-ux/muk';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import {
  IpAntihackStateEnum,
  getIpAntihackQueryKey,
  unblockAntiHackIp,
} from '@/data/api';
import { useGetIpAntihack } from '@/data/hooks/ip';
import { TRANSLATION_NAMESPACES, fromIdToIp, ipFormatter } from '@/utils';

const DEFAULT_LOG_DISPLAY_CLASS_NAMES =
  'whitespace-pre overflow-scroll bg-stone-200 p-2 rounded-md border-1 border-solid border-stone-300  min-w-full max-h-48';

export default function AntiHackModal() {
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.antiHack,
    NAMESPACES.ACTIONS,
    TRANSLATION_NAMESPACES.error,
  ]);
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { id, parentId } = useParams();
  const { ip } = ipFormatter(fromIdToIp(id));
  const { ip: parentIp } = ipFormatter(fromIdToIp(parentId));
  const { addSuccess, addError, clearNotifications } = useNotifications();
  const queryClient = useQueryClient();
  const { trackClick, trackPage } = useOvhTracking();
  const format = useFormatDate();

  const { ipAntihack, loading: isIpAntihackLoading } = useGetIpAntihack({
    ip: parentIp,
  });

  const toBeUnblocked = React.useMemo(
    () =>
      ipAntihack?.find(
        (antihack) =>
          antihack.ipBlocked === ip &&
          antihack.state === IpAntihackStateEnum.BLOCKED,
      ),
    [ipAntihack, ip],
  );

  const logs = React.useMemo(
    () =>
      toBeUnblocked?.logs.length
        ? toBeUnblocked?.logs
        : t('anti_hack_no_log_available'),
    [toBeUnblocked, t],
  );

  const logsDisplayClasses = React.useMemo(
    () =>
      toBeUnblocked?.logs.length
        ? DEFAULT_LOG_DISPLAY_CLASS_NAMES
        : `${DEFAULT_LOG_DISPLAY_CLASS_NAMES} text-center`,
    [toBeUnblocked],
  );

  const closeModal = () => {
    navigate(`..?${search.toString()}`);
  };

  const fields = useMemo(
    () =>
      !!toBeUnblocked?.state &&
      !!toBeUnblocked?.blockedSince &&
      toBeUnblocked?.time
        ? [
            {
              label: t('anti_hack_status'),
              value: toBeUnblocked.state,
              key: 'antihack_ipState',
            },
            {
              label: t('anti_hack_blocked_since'),
              value: format({
                date: new Date(toBeUnblocked.blockedSince),
                format: 'PPPpp',
              }),
              key: 'antihack_blockedSince',
            },
            {
              label: t('anti_hack_time'),
              value: toBeUnblocked.time,
              key: 'antihack_time',
            },
          ]
        : [],
    [toBeUnblocked, format, t],
  );

  const { isPending, mutate: unblockAntihackHandler } = useMutation({
    mutationFn: () => unblockAntiHackIp({ ip: parentIp, ipBlocked: ip }),
    onSuccess: () => {
      clearNotifications();
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'anti-hack-unblock_success',
      });
      addSuccess(
        t('unblock_anti_hack_ip_success', {
          ipBlocked: toBeUnblocked?.ipBlocked,
        }),
      );

      queryClient.invalidateQueries({
        queryKey: getIpAntihackQueryKey({ ip: parentIp }),
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
          ipBlocked: toBeUnblocked?.ipBlocked,
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
      actionType: 'action',
      actions: ['anti-hack-unblock', 'cancel'],
    });
    closeModal();
  };

  return (
    <Modal
      heading={t('unblock_anti_hack_title')}
      onOpenChange={closeHandler}
      primaryButton={{
        label: t('unblock_anti_hack_ip_action'),
        onClick: () => {
          trackClick({
            location: PageLocation.popup,
            buttonType: ButtonType.button,
            actionType: 'action',
            actions: ['anti-hack-unblock', 'confirm'],
          });
          unblockAntihackHandler();
        },
        loading: isPending,
      }}
      secondaryButton={{
        label: t('close', { ns: NAMESPACES.ACTIONS }),
        onClick: closeHandler,
      }}
      loading={isIpAntihackLoading}
    >
      <div className="flex w-full flex-col">
        {fields.map(({ label, value, key }) => (
          <div className="mb-2 flex gap-x-4" key={key}>
            <Text
              className="w-1/2 text-right font-semibold"
              preset={TEXT_PRESET.heading6}
            >
              {label}
            </Text>
            <Text className="w-1/2">{value}</Text>
          </div>
        ))}
        <div className="mb-2 flex">
          <Text className={logsDisplayClasses} preset="code">
            {logs}
          </Text>
        </div>
      </div>
    </Modal>
  );
}
