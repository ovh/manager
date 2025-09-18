import { ActionMenu } from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_COLOR as BUTTON_COLOR,
  ODS_BUTTON_VARIANT as BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShellContext,
  useNavigationGetUrl,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import {
  ActionEnum,
  LifecycleCapacitiesEnum,
} from '@/alldoms/enum/service.enum';
import { allDomManagerService, RENEW_URL } from '@/alldoms/constants';
import { hasTerminateAtExpirationDateAction } from '@/alldoms/utils/utils';

interface DatagridColumnActionMenuProps {
  readonly id: string;
  readonly serviceName: string;
  readonly pendingActions: LifecycleCapacitiesEnum[];
  readonly terminateUrl: string;
  readonly cancelTerminateUrl?: string;
  readonly whichAction: ActionEnum;
}

export default function ServiceActionMenu({
  id,
  serviceName,
  terminateUrl,
  cancelTerminateUrl,
  pendingActions,
  whichAction,
}: DatagridColumnActionMenuProps) {
  const { t } = useTranslation('allDom');
  const navigate = useNavigate();

  const {
    environment: { user },
  } = useContext(ShellContext);

  const renewUrl = `${RENEW_URL[user.ovhSubsidiary] ||
    RENEW_URL.default}${serviceName}`;

  const { data: billingUrl } = useNavigationGetUrl([
    'billing',
    `/autorenew/update`,
    { serviceId: serviceName, serviceType: allDomManagerService },
  ]);

  const { data: handleContactUrl } = useNavigationGetUrl([
    'account',
    '/contacts/services/edit',
    {
      serviceName,
      category: allDomManagerService,
      service: serviceName,
      categoryType: allDomManagerService,
    },
  ]);

  const disableAction = hasTerminateAtExpirationDateAction(pendingActions);

  const renewCGIAction = {
    id: 1,
    label: t('allDom_table_action_renew'),
    href: renewUrl,
    target: '_blank',
    'data-testid': 'renew-button',
    isDisabled: disableAction,
  };

  const renewalAction = {
    id: 2,
    label: t(`allDom_table_action_renewal`),
    href: `${billingUrl as string}`,
    target: '_blank',
    isDisabled: disableAction,
  };

  const handleContactAction = {
    id: 3,
    label: t(`allDom_table_action_handle_contacts`),
    href: `${handleContactUrl as string}`,
    target: '_blank',
    'data-testid': 'handleContact-button',
  };

  const terminateAction = {
    id: 4,
    label: t('allDom_table_action_terminate'),
    onClick: () => navigate(terminateUrl),
    color: BUTTON_COLOR.critical,
    isDisabled: disableAction,
  };

  const cancelTerminate = {
    id: 5,
    label: t('allDom_table_action_cancel_terminate'),
    onClick: () => navigate(cancelTerminateUrl),
  };

  let items = [];

  switch (whichAction) {
    case ActionEnum.OnlyContact:
      items = [handleContactAction];
      break;
    case ActionEnum.OnlyRenew:
      items = [
        renewCGIAction,
        renewalAction,
        disableAction ? cancelTerminate : terminateAction,
      ];
      break;
    default:
      items = [
        renewCGIAction,
        renewalAction,
        handleContactAction,
        disableAction ? cancelTerminate : terminateAction,
      ];
      break;
  }

  return (
    <ActionMenu
      id={id}
      isCompact
      variant={BUTTON_VARIANT.ghost}
      items={items}
    />
  );
}
