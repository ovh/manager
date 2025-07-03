import { ActionMenu } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShellContext,
  useNavigationGetUrl,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import { ServiceInfoUpdateEnum } from '@/alldoms/enum/service.enum';
import { RENEW_URL } from '@/alldoms/constants';

interface DatagridColumnActionMenuProps {
  readonly serviceId: string;
  readonly serviceName: string;
  readonly allDomResourceState: ServiceInfoUpdateEnum;
  readonly terminateUrl: string;
  readonly isContact: boolean;
}

export default function ServiceActionMenu({
  serviceId,
  serviceName,
  terminateUrl,
  allDomResourceState,
  isContact = true,
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
    { serviceId: serviceName, serviceType: 'ALL_DOM' },
  ]);

  const { data: handleContactUrl } = useNavigationGetUrl([
    'account',
    '/contacts/services/edit',
    { categoryType: 'ALL_DOM', service: serviceName },
  ]);

  const disableAction =
    allDomResourceState === ServiceInfoUpdateEnum.TerminateAtExpirationDate;

  return (
    <ActionMenu
      id={serviceId}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
      items={[
        !isContact && {
          id: 1,
          label: t('allDom_table_action_renew'),
          href: renewUrl,
          target: '_blank',
          'data-testid': 'renew-button',
        },
        !isContact && {
          id: 2,
          label: t(`allDom_table_action_renewal`),
          href: `${billingUrl}`,
          target: '_blank',
          isDisabled: disableAction,
        },
        isContact && {
          id: 3,
          label: t(`allDom_table_action_handle_contacts`),
          href: `${handleContactUrl}`,
          target: '_blank',
          'data-testid': 'handleContact-button',
        },
        !isContact && {
          id: 4,
          label: t('allDom_table_action_terminate'),
          onClick: () => navigate(terminateUrl),
          color: ODS_BUTTON_COLOR.critical,
          isDisabled: disableAction,
        },
      ].filter(Boolean)}
    />
  );
}
