import { ActionMenu } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import {
  ServiceInfoRenewMode,
  ServiceResourceStatus,
} from '@/alldoms/enum/service.enum';

interface DatagridColumnActionMenuProps {
  readonly serviceId: string;
  readonly serviceName: string;
  readonly serviceRenewMode: string;
  readonly isServiceNameUrl: boolean;
  readonly serviceRegistrationStatus: ServiceResourceStatus;
}

export default function DatagridColumnActionMenu({
  serviceId,
  serviceName,
  serviceRenewMode,
  isServiceNameUrl,
  serviceRegistrationStatus,
}: DatagridColumnActionMenuProps) {
  const { t } = useTranslation('allDom');
  const navigate = useNavigate();

  const renewAction =
    serviceRenewMode === ServiceInfoRenewMode.Automatic ? 'disable' : 'enable';

  const { data: billingUrl } = useNavigationGetUrl([
    'dedicated',
    `#/billing/${renewAction}`,
    { selectedType: 'ALL_DOM', searchText: serviceName, services: serviceId },
  ]);

  const { data: handleContactUrl } = useNavigationGetUrl([
    'new-account',
    '/contacts/services/edit',
    { categoryType: 'ALL_DOM', service: serviceName },
  ]);

  const disableAction =
    serviceRegistrationStatus === ServiceResourceStatus.Deleting ||
    serviceRegistrationStatus === ServiceResourceStatus.Suspended;

  let terminateURL = 'terminate';
  if (isServiceNameUrl) {
    terminateURL += `/${serviceName}`;
  }

  return (
    <ActionMenu
      id={serviceId}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
      items={[
        {
          id: 1,
          label: t('allDom_table_action_renew'),
          href: `https://www.ovh.com/cgi-bin/order/renew.cgi?domainChooser=${serviceName}`,
          target: '_blank',
          'data-testid': 'renew-button',
        },
        {
          id: 2,
          label: t(`allDom_table_action_${renewAction}_renewal`),
          href: `${billingUrl}`,
          target: '_blank',
          isDisabled: disableAction,
        },
        {
          id: 3,
          label: t(`allDom_table_action_handle_contacts`),
          href: `${handleContactUrl}`,
          target: '_blank',
          'data-testid': 'handleContact-button',
        },
        {
          id: 4,
          label: t('allDom_table_action_terminate'),
          onClick: () => navigate(terminateURL),
          color: ODS_BUTTON_COLOR.critical,
          isDisabled: disableAction,
        },
      ]}
    />
  );
}
