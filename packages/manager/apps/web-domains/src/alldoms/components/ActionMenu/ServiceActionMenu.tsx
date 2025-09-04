import { ActionMenu } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShellContext,
  useNavigationGetUrl,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import { ActionEnum } from '@/alldoms/enum/service.enum';
import { allDomManagerService, RENEW_URL } from '@/alldoms/constants';
import { LifecycleCapacitiesEnum } from '@/common/enum/common.enum';

interface DatagridColumnActionMenuProps {
  readonly id: string;
  readonly serviceName: string;
  readonly lifecycleCapacities: LifecycleCapacitiesEnum[];
  readonly terminateUrl: string;
  readonly whichAction: ActionEnum;
}

export default function ServiceActionMenu({
  id,
  serviceName,
  terminateUrl,
  lifecycleCapacities,
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
    { categoryType: allDomManagerService, service: serviceName },
  ]);

  const disableAction = lifecycleCapacities.includes(
    LifecycleCapacitiesEnum.TerminateAtExpirationDate,
  );

  const renewCGIAction = {
    id: 1,
    label: t('allDom_table_action_renew'),
    href: renewUrl,
    target: '_blank',
    'data-testid': 'renew-button',
  };

  const renewalAction = {
    id: 2,
    label: t(`allDom_table_action_renewal`),
    href: `${billingUrl}`,
    target: '_blank',
    isDisabled: disableAction,
  };

  const handleContactAction = {
    id: 3,
    label: t(`allDom_table_action_handle_contacts`),
    href: `${handleContactUrl}`,
    target: '_blank',
    'data-testid': 'handleContact-button',
  };

  const terminateAction = {
    id: 4,
    label: t('allDom_table_action_terminate'),
    onClick: () => navigate(terminateUrl),
    color: ODS_BUTTON_COLOR.critical,
    isDisabled: disableAction,
  };

  let items = [];

  switch (whichAction) {
    case ActionEnum.OnlyContact:
      items = [handleContactAction];
      break;
    case ActionEnum.OnlyRenew:
      items = [renewCGIAction, renewalAction, terminateAction];
      break;
    default:
      items = [
        renewCGIAction,
        renewalAction,
        handleContactAction,
        terminateAction,
      ];
      break;
  }

  return (
    <ActionMenu
      id={id}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
      items={items}
    />
  );
}
