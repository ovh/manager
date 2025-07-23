import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Datagrid } from '@ovh-ux/manager-react-components';
import {
  Button,
  BUTTON_SIZE,
  Icon,
  ICON_NAME,
  Link,
  Message,
  MESSAGE_COLOR,
  MessageBody,
  MessageIcon,
} from '@ovhcloud/ods-react';
import { useNavigate } from 'react-router-dom';
import {
  TDatagridDnsDetails,
  TDomainResource,
} from '@/domain/types/domainResource';
import { useDomainDnsDatagridColumns } from '@/domain/hooks/domainTabs/useDomainDnsDatagridColumns';
import { computeDnsDetails } from '@/domain/utils/utils';
import { NameServerStatusEnum } from '@/domain/enum/nameServerStatus.enum';
import AnycastOrderButtonComponent from '@/domain/components/AnycastOrder/AnycastOrderButton';

interface DnsConfigurationTabProps {
  readonly domainResource: TDomainResource;
}

export default function DnsConfigurationTab({
  domainResource,
}: DnsConfigurationTabProps) {
  const { t } = useTranslation(['domain', 'web-domains/error']);
  const dnsDetails: TDatagridDnsDetails[] = computeDnsDetails(domainResource);
  const [anycastTerminateModalOpen, setAnycastTerminateModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const columns = useDomainDnsDatagridColumns();

  const onOpenAnycastTerminateModal = () => {
    setAnycastTerminateModalOpen(!anycastTerminateModalOpen);
  }
  return (
    <div data-testid="datagrid">
      {dnsDetails.find((dns) => dns.status === NameServerStatusEnum.ERROR) && (
        <Message
          color={MESSAGE_COLOR.warning}
          className="w-full mt-4"
          dismissible={false}
        >
          <MessageIcon name="triangle-exclamation" />
          <MessageBody>{t('domain_tab_DNS_error_warning')}</MessageBody>
        </Message>
      )}
      <Message
        color={MESSAGE_COLOR.information}
        className="w-full mt-4"
        dismissible={false}
      >
        <MessageIcon name="circle-info" />
        <MessageBody>
          {t('domain_tab_DNS_information_message')}
          <Link href="https://www.zonemaster.net/en/run-test" target="_blank">
            {t('domain_tab_DNS_information_link')}
            <Icon name={ICON_NAME.externalLink} />
          </Link>
        </MessageBody>
      </Message>
      <div className="flex gap-4 my-6">
        <Button size={BUTTON_SIZE.sm} onClick={() => navigate('dns-modify')}>
          {t('domain_dns_tab_button_modify_dns')}
        </Button>
        <AnycastOrderButtonComponent
          anycastTerminateModalOpen={anycastTerminateModalOpen}
          serviceName={domainResource.id}
          onOpenAnycastTerminateModal={onOpenAnycastTerminateModal}
        />
      </div>
      <Datagrid
        columns={columns}
        items={dnsDetails}
        totalItems={dnsDetails?.length ? dnsDetails.length : 0}
      />
    </div>
  );
}
