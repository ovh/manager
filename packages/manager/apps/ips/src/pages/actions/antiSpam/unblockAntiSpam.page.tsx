import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addSeconds, isBefore } from 'date-fns';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TABLE_SIZE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Modal,
  useNotifications,
  useFormatDate,
  Datagrid,
} from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  unblockAntiSpamIp,
  getIpSpamQueryKey,
  IpSpamStateEnum,
  IpSpamStatType,
} from '@/data/api';
import { useGetIpSpam, useGetIpSpamStats } from '@/data/hooks';
import { fromIdToIp, ipFormatter } from '@/utils';

export default function AntiSpamModal() {
  const { t } = useTranslation(['anti-spam', NAMESPACES.ACTIONS, 'error']);
  const [ipBlocked, setIpBlocked] = useState<string | undefined>();
  const [ipState, setIpState] = useState<string | undefined>();
  const [blockedSince, setBlockedSince] = useState<string | undefined>();
  const [estimationUnblockingDate, setEstimationUnblockingDate] = useState<
    Date
  >();
  const [isUnblockingDisabled, setIsUnblockingDisabled] = useState<boolean>(
    true,
  );
  const navigate = useNavigate();
  const [search] = useSearchParams();

  const { id, parentId } = useParams();
  const { ip } = ipFormatter(fromIdToIp(id));
  const { ip: parentIp } = ipFormatter(fromIdToIp(parentId));

  const { addSuccess, addError, clearNotifications } = useNotifications();
  const queryClient = useQueryClient();
  const { trackClick, trackPage } = useOvhTracking();
  const format = useFormatDate();

  const { ipSpam, isLoading: isIpSpamLoading } = useGetIpSpam({
    ip: parentIp,
    enabled: true,
  });

  useEffect(() => {
    if (ipSpam) {
      const toBeUnblocked = ipSpam.find(
        (spam) =>
          spam.ipSpamming === ip && spam.state === IpSpamStateEnum.BLOCKED,
      );
      setIpBlocked(toBeUnblocked?.ipSpamming);
      setIpState(toBeUnblocked?.state);
      setBlockedSince(toBeUnblocked?.date);
      const unblockingDate = addSeconds(
        new Date(toBeUnblocked?.date),
        toBeUnblocked?.time ?? 0,
      );
      setEstimationUnblockingDate(unblockingDate);
      setIsUnblockingDisabled(isBefore(Date.now(), unblockingDate));
    }
  }, [ipSpam]);

  const { ipSpamStats, isLoading: isIpSpamStatsLoading } = useGetIpSpamStats({
    ip: parentIp,
    ipSpamming: ipBlocked,
    enabled: !!ipBlocked,
  });

  const closeModal = () => navigate(`..?${search.toString()}`);

  const { isPending, mutate: unblockAntiSpamHandler } = useMutation({
    mutationFn: () => unblockAntiSpamIp({ ip: parentIp, ipBlocked }),
    onSuccess: async () => {
      clearNotifications();
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'unblock-anti-spam-success',
      });
      addSuccess(t('unblock_anti_spam_ip_success', { ipBlocked }));
      await queryClient.invalidateQueries({
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
      actionType: 'action',
      actions: ['anti-spam-unblock', 'cancel'],
    });
    closeModal();
  };

  const fields = useMemo(
    () =>
      !!ipState && !!blockedSince
        ? [
            {
              label: t('anti_spam_status'),
              value: t('anti_spam_status_BLOCKED'),
              key: 'ipState',
            },
            {
              label: t('anti_spam_blocked_since'),
              value: format({ date: new Date(blockedSince), format: 'PPPpp' }),
              key: 'blockedSince',
            },
            {
              label: t('anti_spam_estimation_unblocking_date'),
              value: format({
                date: new Date(estimationUnblockingDate),
                format: 'PPPpp',
              }),
              key: 'estimationUnblockingDate',
            },
          ]
        : [],
    [ipState, blockedSince, estimationUnblockingDate, format, t],
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
      heading={t('unblock_anti_spam_title', { ipBlocked })}
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
      isPrimaryButtonDisabled={isUnblockingDisabled}
      secondaryLabel={t('close', { ns: NAMESPACES.ACTIONS })}
      onSecondaryButtonClick={closeHandler}
      isLoading={isIpSpamLoading}
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
        <div className="flex mb-2 overflow-y-auto max-h-56">
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
