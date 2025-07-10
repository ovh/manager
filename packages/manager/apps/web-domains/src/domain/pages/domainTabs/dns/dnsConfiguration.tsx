import React from 'react';
import { useTranslation } from 'react-i18next';

import { Datagrid } from '@ovh-ux/manager-react-components';
import {
  Button,
  Icon,
  Link,
  Message,
  MessageBody,
  MessageIcon,
} from '@ovhcloud/ods-react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_MESSAGE_COLOR,
} from '@ovhcloud/ods-components';
import { useNavigate } from 'react-router-dom';
import {
  TDatagridDnsDetails,
  TDomainResource,
} from '@/domain/types/domainResource';
import { useDomainDnsDatagridColumns } from '@/domain/hooks/domainTabs/useDomainDnsDatagridColumns';
import { computeDnsDetails } from '@/domain/utils/utils';
import { NameServerStatusEnum } from '@/domain/enum/nameServerStatus.enum';
import { useGenerateUrl } from '@/domain/hooks/generateUrl/useGenerateUrl';
import { urls } from '@/domain/routes/routes.constant';

interface DnsConfigurationTabProps {
  readonly domainResource: TDomainResource;
}

export default function DnsConfigurationTab({
  domainResource,
}: DnsConfigurationTabProps) {
  const { t } = useTranslation(['domain', 'web-domains/error']);
  const dnsDetails: TDatagridDnsDetails[] = computeDnsDetails(domainResource);

  const navigate = useNavigate();
  const columns = useDomainDnsDatagridColumns();
  return (
    <div data-testid="datagrid">
      {dnsDetails.find((dns) => dns.status === NameServerStatusEnum.ERROR) && (
        <Message
          color={ODS_MESSAGE_COLOR.warning}
          className="w-full mt-4"
          dismissible={false}
        >
          <MessageIcon name="triangle-exclamation" />
          <MessageBody>{t('domain_tab_DNS_error_warning')}</MessageBody>
        </Message>
      )}
      <Message
        color={ODS_MESSAGE_COLOR.information}
        className="w-full mt-4"
        dismissible={false}
      >
        <MessageIcon name="circle-info" />
        <MessageBody>
          {t('domain_tab_DNS_information_message')}
          <Link href="https://www.zonemaster.net/en/run-test">
            {t('domain_tab_DNS_information_link')}
            <Icon name={ODS_ICON_NAME.externalLink} />
          </Link>
        </MessageBody>
      </Message>
      <div className="flex gap-4 my-6">
        {/* FIXME: page implemented by MANAGER-18978 */}
        <Button size={ODS_BUTTON_SIZE.sm}>
          {t('domain_dns_tab_button_modify_dns')}
        </Button>
        {/* FIXME: page implemented by MANAGER-19005 */}
        <Button
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.outline}
          onClick={() =>
            navigate(
              useGenerateUrl(urls.domainTabOrderAnycast, 'path', {
                serviceName: domainResource.id,
              }),
              { replace: true },
            )
          }
        >
          {t('domain_dns_tab_button_order_anycast')}
        </Button>
      </div>
      <Datagrid
        columns={columns}
        items={dnsDetails}
        totalItems={dnsDetails?.length ? dnsDetails.length : 0}
      />
    </div>
  );
}
