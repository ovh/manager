import { ActionMenu } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import { ServiceInfoRenewMode } from '@/alldoms/enum/service.enum';

interface DatagridColumnActionMenuProps {
  readonly serviceId: string;
  readonly serviceName: string;
  readonly serviceModeRenew: string;
  readonly context: string;
}

export default function DatagridColumnActionMenu({
  serviceId,
  serviceName,
  serviceModeRenew,
  context,
}: DatagridColumnActionMenuProps) {
  const { t } = useTranslation('allDom');
  const { data: billingUrl } = useNavigationGetUrl(['billing', '', {}]);
  const { data: handleContactUrl } = useNavigationGetUrl(['account', '', {}]);
  const url = `terminate${context === 'listing' ? `/${serviceName}` : ''}`;

  const renewAction =
    serviceModeRenew === ServiceInfoRenewMode.Automatic ? 'disable' : 'enable';
  const navigate = useNavigate();

  return (
    <ActionMenu
      id={serviceId}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
      items={[
        {
          id: 1,
          label: t('allDom_table_action_renew'),
          href: `https://www.ovh.com/cgi-bin/order/renew.cgi?domainChooser=${serviceId}`,
          target: '_blank',
          'data-testid': 'renew-button',
        },
        {
          id: 2,
          label: t('allDom_table_action_terminate'),
          onClick: () => navigate(url),
        },
        {
          id: 3,
          label: t(`allDom_table_action_${renewAction}_renewal`),
          href: `${billingUrl}/autorenew/${renewAction}?selectedType=ALL_DOMsearchText=${serviceName}&services=${serviceId}`,
          target: '_blank',
        },
        {
          id: 4,
          label: t(`allDom_table_action_handle_contacts`),
          href: `${handleContactUrl}/contacts/services/edit?service=${serviceName}&categoryType=ALL_DOM`,
          target: '_blank',
          'data-testid': 'handleContact-button',
        },
      ]}
    />
  );
}
