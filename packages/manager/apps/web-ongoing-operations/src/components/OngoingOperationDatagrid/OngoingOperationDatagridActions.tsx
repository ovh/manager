import React from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { ActionMenu, useNotifications } from '@ovh-ux/manager-react-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { OngoingOperationDatagridActionsProps } from '@/types';
import { DomainOperationsEnum } from '@/constants';
import { usePendingFoas, useGetDomainInformation } from '@/hooks/data/query';
import { isFoaEligibleOperation } from '@/utils/foa.utils';
import { useNichandle } from '@/hooks/nichandle/useNichandle';
import { useTrackNavigation } from '@/hooks/tracking/useTrackDatagridNavivationLink';

export default function OngoingOperationDatagridActions({
  props,
}: Readonly<OngoingOperationDatagridActionsProps>) {
  const { t } = useTranslation('dashboard');
  const { trackPageNavivationTile } = useTrackNavigation();
  const { clearNotifications } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  // A trade still running, and nothing else : a done or cancelled operation
  // is over, and its row must not offer the validation anymore. Also what
  // keeps the designated agent out of the alldom and dns sections : their
  // datasets (/me/task/domain?type=alldom, /me/task/dns) can never carry a
  // DomainTrade function, only domain operations can.
  const isOngoingTrade = isFoaEligibleOperation(props);
  // Per row lookup, on purpose : the entry point must be hidden when every FOA
  // is already answered, and that verdict only exists once the FOAs are known.
  // Bounded by the DomainTrade gate below and by the 10 rows the datagrid
  // loads, then cached by the app wide staleTime, so a re-render or a round
  // trip through the pages costs nothing. Deferring to the menu opening is not
  // possible : the shared ActionMenu exposes no open callback, and the item
  // visibility depends on the very data we would be waiting for.
  const { taskId, pendingFoas, isDesignatedAgentAllowed } = usePendingFoas(
    props.domain ?? '',
    isOngoingTrade,
  );

  // Answering a FOA engages both holders, so only the admin contact of the
  // domain is offered the action. Already fetched by the domain column, so this
  // is a cache hit. Fails open while the identity or the service info is
  // unknown : the real authorization is API side, this only avoids proposing
  // an action the user is not entitled to.
  const { nichandle } = useNichandle();
  const { data: serviceInfo } = useGetDomainInformation(props.domain ?? '');
  const isAdminContact =
    !nichandle || !serviceInfo || nichandle === serviceInfo.contactAdmin.id;

  const canUpdate = props.canAccelerate || props.canRelaunch || props.canCancel;
  const canValidateFoa =
    isOngoingTrade &&
    !!taskId &&
    pendingFoas.length > 0 &&
    isAdminContact &&
    isDesignatedAgentAllowed;

  return (
    <ActionMenu
      id={`${props.id}`}
      isCompact
      isDisabled={!canUpdate && !canValidateFoa}
      variant={ODS_BUTTON_VARIANT.ghost}
      items={[
        {
          id: 1,
          label: t('domain_operations_tab_popover_update'),
          className: clsx(!canUpdate && 'hidden', 'menu-item-button'),
          onClick: () => {
            const url = `${location.pathname}/update/${props.id}`;
            trackPageNavivationTile(url);
            navigate(url);
            clearNotifications();
          },
        },
        {
          id: 2,
          label: t('domain_operations_tab_popover_progress'),
          className: clsx(
            props.function !== DomainOperationsEnum.DomainIncomingTransfer &&
              'hidden',
            'menu-item-button',
          ),
          onClick: () => {
            const url = `/tracking/${props.id}`;
            trackPageNavivationTile(url);
            navigate(url);
          },
        },
        {
          id: 3,
          label: t('domain_operations_foa_cta'),
          className: clsx(!canValidateFoa && 'hidden', 'menu-item-button'),
          onClick: () => {
            const url = `${location.pathname}/foa/${props.id}`;
            trackPageNavivationTile(url);
            navigate(url);
            clearNotifications();
          },
        },
      ]}
    />
  );
}
