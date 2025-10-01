import {
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Divider,
  ICON_NAME,
  Message,
  MESSAGE_COLOR,
  MessageBody,
  MessageIcon,
} from '@ovhcloud/ods-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ipaddr from 'ipaddr.js';
import { useNavigate } from 'react-router-dom';
import { TDomainZone } from '@/domain/types/domainZone';
import { TDomainResource, TNameServer } from '@/domain/types/domainResource';
import { ActiveConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';
import DnsLineInput from '@/domain/components/ModifyNameServer/DnsLineInput';
import {
  canSaveNewDnsConfig,
  computeDisplayNameServers,
} from '@/domain/utils/dnsUtils';
import NewDnsConfigModal from '@/domain/components/ModifyNameServer/NewDnsConfigModal';

interface DnsConfigurationFormProps {
  readonly domainZone: TDomainZone;
  readonly selectedConfig: ActiveConfigurationTypeEnum;
  readonly currentState: TDomainResource['currentState'];
  readonly serviceName: string;
}

export default function DnsConfigurationForm({
  selectedConfig,
  domainZone,
  serviceName,
  currentState,
}: DnsConfigurationFormProps) {
  const { t } = useTranslation('domain');
  const navigate = useNavigate();

  const initialServers = computeDisplayNameServers(
    currentState.dnsConfiguration,
    domainZone,
    selectedConfig,
  );

  const [nameServers, setNameServers] = useState<TNameServer[]>(initialServers);
  const [isSavingModalOpen, setIsSavingModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>(null);

  const handleAdd = ({ server, ip }: { server: string; ip: string }) => {
    if (!server) return;

    const newEntry: TNameServer = { nameServer: server.replace('/ /g', '') };

    if (ip && ipaddr.isValid(ip)) {
      const parsed = ipaddr.parse(ip);
      const kind = parsed.kind();
      if (kind === 'ipv4') {
        newEntry.ipv4 = ip;
      } else if (kind === 'ipv6') {
        newEntry.ipv6 = ip;
      }
    }

    setNameServers((prev) => [...prev, newEntry]);
  };

  const handleRemove = (indexToRemove: number) => {
    setNameServers((prev) =>
      prev.filter((_: TNameServer, i: number) => i !== indexToRemove),
    );
  };

  const canSave = canSaveNewDnsConfig(
    initialServers,
    nameServers,
    currentState.dnsConfiguration,
  );

  const handleReset = () => {
    setNameServers(initialServers);
    setFeedbackMessage(null);
  };

  return (
    <div className="mt-6 ml-8">
      <Message dismissible={false} className="mb-6 w-full">
        <MessageIcon name={ICON_NAME.circleInfo} />
        <MessageBody>
          {t('domain_tab_DNS_modification_form_dns_number', {
            min: currentState.dnsConfiguration.minDNS,
            max: currentState.dnsConfiguration.maxDNS,
          })}
        </MessageBody>
      </Message>
      <div>
        {nameServers.map((ns, index) => (
          <React.Fragment key={ns.nameServer}>
            <DnsLineInput
              server={ns.nameServer.trim()}
              ip={ns.ipv4 || ns.ipv6}
              showLabels={index === 0}
              onRemove={() => handleRemove(index)}
              editable={false}
              allServers={nameServers}
            />
            <Divider className="my-6" data-testid={'dns-divider'} />
          </React.Fragment>
        ))}
      </div>
      <DnsLineInput
        type={'add'}
        server=""
        showLabels={true}
        onAdd={handleAdd}
        editable={true}
        allServers={nameServers}
      />
      {feedbackMessage && (
        <Message
          color={MESSAGE_COLOR.critical}
          className="mt-6 w-full"
          dismissible={false}
        >
          <MessageIcon name={ICON_NAME.circleXmark} />
          <MessageBody>{feedbackMessage}</MessageBody>
        </Message>
      )}
      <div className="flex gap-4 mt-6">
        <Button
          variant={BUTTON_VARIANT.ghost}
          size={BUTTON_SIZE.sm}
          onClick={() => handleReset()}
        >
          {t('domain_tab_DNS_modification_button_restore_form')}
        </Button>
        <Button
          size={BUTTON_SIZE.sm}
          onClick={() => setIsSavingModalOpen(true)}
          disabled={!canSave}
          data-testid="apply-btn"
        >
          {t('domain_tab_DNS_modification_button_apply')}
        </Button>
        <NewDnsConfigModal
          serviceName={serviceName}
          nameServers={nameServers}
          isModalOpen={isSavingModalOpen}
          onClose={() => setIsSavingModalOpen(false)}
          onError={(msg: string) => {
            setFeedbackMessage(
              `${t('domain_tab_DNS_modification_update_error')}${msg}`,
            );
          }}
          onSuccess={() =>
            navigate(`/domain/${serviceName}/dns`, {
              state: {
                successMessage: t('domain_tab_DNS_modification_update_success'),
              },
            })
          }
        />
      </div>
    </div>
  );
}
