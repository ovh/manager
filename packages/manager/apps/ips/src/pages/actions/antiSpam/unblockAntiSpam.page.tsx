import React, { useMemo } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addSeconds, isBefore } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { ODS_TABLE_SIZE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  Datagrid,
  Modal,
  useFormatDate,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import {
  IpSpamStatType,
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

  const { ipSpam, isLoading: isIpSpamLoading } = useGetIpSpam({ ip: parentIp });
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

  const { ipSpamStats, isLoading: isIpSpamStatsLoading } = useGetIpSpamStats({
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
      label: t('anti_spam_stat_date'),
      size: 1000,
      cell: (item: IpSpamStatType) => {
        const formattedDate = format({
          date: new Date(item.timestamp * 1000),
          format: 'PPp',
        });
        return <>{formattedDate}</>;
      },
    },
    {
      id: 'averageSpamscore',
      label: t('anti_spam_stat_score'),
      cell: (item: IpSpamStatType) => <>{item.averageSpamscore}</>,
    },
    {
      id: 'total',
      label: t('anti_spam_stat_total'),
      cell: (item: IpSpamStatType) => <>{item.total}</>,
    },
    {
      id: 'numberOfSpams',
      label: t('anti_spam_stat_nb_emails'),
      cell: (item: IpSpamStatType) => <>{item.numberOfSpams}</>,
    },
  ];

  return (
    <Modal
      isOpen
      onDismiss={closeHandler}
      heading={t('unblock_anti_spam_title', {
        ipBlocked: toBeUnblocked?.ipSpamming,
      })}
      primaryLabel={t('unblock_anti_spam_ip_action')}
      onPrimaryButtonClick={() => {
        trackClick({
          location: PageLocation.popup,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['configure_anti-spam-unblock', 'confirm'],
        });
        unblockAntiSpamHandler();
      }}
      isPrimaryButtonLoading={isPending}
      isPrimaryButtonDisabled={
        unblockingDate ? isBefore(Date.now(), unblockingDate) : true
      }
      secondaryLabel={t('close', { ns: NAMESPACES.ACTIONS })}
      onSecondaryButtonClick={closeHandler}
      isLoading={isIpSpamLoading}
    >
      <div className="flex w-full flex-col">
        {fields.map(({ label, value, key }) => (
          <div className="mb-2 flex gap-x-4" key={key}>
            <OdsText
              className="w-1/2 text-right font-semibold"
              preset={ODS_TEXT_PRESET.heading6}
            >
              {label}
            </OdsText>
            <OdsText className="w-1/2">{value}</OdsText>
          </div>
        ))}
        <div className="mb-2 flex max-h-56 overflow-y-auto">
          <Datagrid
            size={ODS_TABLE_SIZE.sm}
            columns={ipSpamStatsColumnDefinitions}
            items={ipSpamStats}
            totalItems={ipSpamStats?.length}
            hasNextPage={false}
            onFetchNextPage={false}
            isLoading={isIpSpamStatsLoading}
          />
        </div>
      </div>
    </Modal>
  );
}
