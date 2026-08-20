import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu, useNotifications } from '@ovh-ux/manager-react-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { OngoingOperationDatagridActionsProps } from '@/types';
import { DomainOperationsEnum } from '@/constants';
import { usePendingFoas } from '@/hooks/data/query';
import { useTrackNavigation } from '@/hooks/tracking/useTrackDatagridNavivationLink';

export default function OngoingOperationDatagridActions({
  props,
}: Readonly<OngoingOperationDatagridActionsProps>) {
  const { t } = useTranslation('dashboard');
  const { trackPageNavivationTile } = useTrackNavigation();
  const { clearNotifications } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const isTrade = props.function === DomainOperationsEnum.DomainTrade;
  // Only a change of registrant carries FOAs, so no other row fetches them
  const { taskId, pendingFoas } = usePendingFoas(props.domain ?? '', isTrade);

  const canUpdate = props.canAccelerate || props.canRelaunch || props.canCancel;
  const canValidateFoa = isTrade && !!taskId && pendingFoas.length > 0;

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
          className: `${!canUpdate && 'hidden'} menu-item-button`,
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
          className: `${props.function !==
            DomainOperationsEnum.DomainIncomingTransfer &&
            'hidden'} menu-item-button`,
          onClick: () => {
            const url = `/tracking/${props.id}`;
            trackPageNavivationTile(url);
            navigate(url);
          },
        },
        {
          id: 3,
          label: t('domain_operations_foa_cta'),
          className: `${!canValidateFoa && 'hidden'} menu-item-button`,
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
