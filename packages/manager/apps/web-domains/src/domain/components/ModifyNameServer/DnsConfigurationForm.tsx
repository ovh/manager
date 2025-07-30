import {
  Divider,
  Message,
  MessageBody,
  MessageIcon,
} from '@ovhcloud/ods-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TDomainZone } from '@/domain/types/domainZone';
import { DNSConfiguration, TNameServer } from '@/domain/types/domainResource';
import { ActiveConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';
import DnsLineInput from './DnsLineInput';
import { computeDisplayNameServers } from '@/domain/utils/dnsUtils';

interface DnsConfigurationFormProps {
  readonly domainZone: TDomainZone;
  readonly selectedConfig: ActiveConfigurationTypeEnum;
  readonly currentStateConfig: DNSConfiguration;
}

export default function DnsConfigurationForm({
  selectedConfig,
  domainZone,
  currentStateConfig,
}: DnsConfigurationFormProps) {
  const { t } = useTranslation('domain');

  const initialServers = computeDisplayNameServers(
    currentStateConfig,
    domainZone,
    selectedConfig,
  );

  const [nameServers, setNameServers] = useState<TNameServer[]>(initialServers);

  const handleAdd = ({ server, ip }: { server: string; ip: string }) => {
    if (!server) return;
    setNameServers((prev) => [
      ...prev,
      { nameServer: server, ipv4: ip || undefined },
    ]);
  };

  const handleRemove = (indexToRemove: number) => {
    setNameServers((prev) =>
      prev.filter((_: TNameServer, i: number) => i !== indexToRemove),
    );
  };

  return (
    <div className="mt-6 ml-8">
      <Message dismissible={false} className="mb-6 w-full">
        <MessageIcon name="circle-info" />
        <MessageBody>
          {t(
            `domain_tab_DNS_modification_form_${selectedConfig.toLowerCase()}_dns_number`,
          )}
        </MessageBody>
      </Message>
      <div>
        {nameServers.map((ns, index) => (
          <React.Fragment key={ns.nameServer}>
            <DnsLineInput
              server={ns.nameServer}
              showLabels={index === 0}
              onRemove={() => handleRemove(index)}
              editable={false}
            />
            <Divider className="my-6" />
          </React.Fragment>
        ))}
      </div>
      <DnsLineInput
        server=""
        ip=""
        showLabels={true}
        onAdd={handleAdd}
        editable={true}
      />
    </div>
  );
}
