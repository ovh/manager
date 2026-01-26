import React, { useMemo } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addSeconds, isBefore } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { TABLE_SIZE, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { Datagrid, Modal, useFormatDate, useNotifications } from '@ovh-ux/muk';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import {
  IpSpamStateEnum,
  getIpSpamQueryKey,
  unblockAntiSpamIp,
} from '@/data/api';
import { useGetIpSpam, useGetIpSpamStats } from '@/data/hooks';
import { TRANSLATION_NAMESPACES, fromIdToIp, ipFormatter } from '@/utils';

export default function AntiSpamModal() {
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.antiSpam,
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

  const { ipSpam, loading: isIpSpamLoading } = useGetIpSpam({ ip: parentIp });
  const toBeUnblocked = useMemo(
    () =>
      ipSpam?.find(
        (spam) =>
          spam.ipSpamming === ip && spam.state === IpSpamStateEnum.BLOCKED,
      ),
    [ipSpam, ip],
  );
  const unblockingDate = React.useMemo(
    () =>
      toBeUnblocked
        ? addSeconds(new Date(toBeUnblocked?.date), toBeUnblocked?.time ?? 0)
        : undefined,
    [toBeUnblocked],
  );

  const { ipSpamStats, loading: isIpSpamStatsLoading } = useGetIpSpamStats({
    ip: parentIp,
    ipSpamming: toBeUnblocked?.ipSpamming,
    enabled: !!toBeUnblocked?.ipSpamming,
  });

  const closeModal = () => {
    navigate(`..?${search.toString()}`);
  };

  const { isPending, mutate: unblockAntiSpamHandler } = useMutation({
    mutationFn: () =>
      unblockAntiSpamIp({
        ip: parentIp,
        ipBlocked: toBeUnblocked?.ipSpamming,
      }),
    onSuccess: () => {
      clearNotifications();
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'unblock-anti-spam-success',
      });
      addSuccess(
        t('unblock_anti_spam_ip_success', {
          ipBlocked: toBeUnblocked?.ipSpamming,
        }),
      );
      queryClient.invalidateQueries({
        queryKey: getIpSpamQueryKey({ ip: parentIp }),
      });
      closeModal();
    },
    onError: (err: ApiError) => {
      clearNotifications();
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'unblock-anti-spam-error',
      });
      closeModal();
      addError(
        t('unblock_anti_spam_ip_error', {
          ipBlocked: toBeUnblocked?.ipSpamming,
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
      actions: ['anti-spam-unblock', 'cancel'],
    });
    closeModal();
  };

  const fields = useMemo(
    () =>
      !!toBeUnblocked?.state && !!toBeUnblocked?.date
        ? [
            {
              label: t('anti_spam_status'),
              value: t('anti_spam_status_BLOCKED'),
              key: 'ipState',
            },
            {
              label: t('anti_spam_blocked_since'),
              value: format({
                date: new Date(toBeUnblocked.date),
                format: 'PPPpp',
              }),
              key: 'blockedSince',
            },
            {
              label: t('anti_spam_estimation_unblocking_date'),
              value: unblockingDate
                ? format({
                    date: new Date(unblockingDate),
                    format: 'PPPpp',
                  })
                : '',
              key: 'estimationUnblockingDate',
            },
          ]
        : [],
    [toBeUnblocked, format, t],
  );

  const ipSpamStatsColumnDefinitions = [
    {
      id: 'timestamp',
      accessorKey: 'timestamp',
      label: t('anti_spam_stat_date'),
      size: 1000,
      cell: ({ getValue }) => {
        const timestamp = getValue() as number;
        const formattedDate = format({
          date: new Date(timestamp * 1000),
          format: 'PPp',
        });
        return <>{formattedDate}</>;
      },
    },
    {
      id: 'averageSpamscore',
      accessorKey: 'averageSpamscore',
      label: t('anti_spam_stat_score'),
      cell: ({ getValue }) => <>{getValue()}</>,
    },
    {
      id: 'total',
      accessorKey: 'total',
      label: t('anti_spam_stat_total'),
      cell: ({ getValue }) => <>{getValue()}</>,
    },
    {
      id: 'numberOfSpams',
      accessorKey: 'numberOfSpams',
      label: t('anti_spam_stat_nb_emails'),
      cell: ({ getValue }) => <>{getValue()}</>,
    },
  ];

  return (
    <Modal
      onOpenChange={closeHandler}
      heading={t('unblock_anti_spam_title', {
        ipBlocked: toBeUnblocked?.ipSpamming,
      })}
      primaryButton={{
        label: t('unblock_anti_spam_ip_action'),
        onClick: () => {
          trackClick({
            location: PageLocation.popup,
            buttonType: ButtonType.button,
            actionType: 'action',
            actions: ['configure_anti-spam-unblock', 'confirm'],
          });
          unblockAntiSpamHandler();
        },
        loading: isPending,
        disabled: !unblockingDate || isBefore(Date.now(), unblockingDate),
      }}
      secondaryButton={{
        label: t('close', { ns: NAMESPACES.ACTIONS }),
        onClick: closeHandler,
      }}
      loading={isIpSpamLoading}
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
        <div className="mb-2 flex max-h-56 overflow-y-auto">
          <Datagrid
            size={TABLE_SIZE.sm}
            columns={ipSpamStatsColumnDefinitions}
            data={ipSpamStats}
            totalCount={ipSpamStats?.length}
            hasNextPage={false}
            isLoading={isIpSpamStatsLoading}
          />
        </div>
      </div>
    </Modal>
  );
}
