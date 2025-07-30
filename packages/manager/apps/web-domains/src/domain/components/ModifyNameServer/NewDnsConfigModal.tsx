import { Text } from '@ovhcloud/ods-react';
import { Modal } from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { TNameServer } from '@/domain/types/domainResource';
import {
  useGetDomainResource,
  useUpdateDomainResource,
} from '@/domain/hooks/data/query';
import { TUpdateDNSConfigError } from '@/domain/types/error';

interface NewDnsConfigModalProps {
  readonly nameServers: TNameServer[];
  readonly isModalOpen: boolean;
  readonly onClose: () => void;
  readonly serviceName: string;
  readonly onError?: (message: string) => void;
  readonly onSuccess?: () => void;
}

export default function NewDnsConfigModal({
  nameServers,
  isModalOpen,
  onClose,
  serviceName,
  onError,
  onSuccess,
}: NewDnsConfigModalProps) {
  const { t } = useTranslation('domain');
  const { t: tCommon } = useTranslation(NAMESPACES.ACTIONS);
  const { updateDomain, isUpdateDomainPending } = useUpdateDomainResource(
    serviceName,
  );
  const { domainResource, isFetchingDomainResource } = useGetDomainResource(
    serviceName,
  );

  const handleApply = () => {
    const checksum = domainResource?.checksum;
    if (!checksum) return;
    const cleanedNameServers = nameServers.map(
      ({ nameServer, ipv4, ipv6 }) => ({
        nameServer,
        ...(ipv4 ? { ipv4 } : {}),
        ...(ipv6 ? { ipv6 } : {}),
      }),
    );

    updateDomain(
      { checksum, nameServers: cleanedNameServers },
      {
        onSuccess: () => {
          onClose();
          onSuccess();
        },
        onError: (error: TUpdateDNSConfigError) => {
          onClose();
          onError?.(error?.response?.data?.message);
        },
      },
    );
  };

  return (
    <Modal
      heading={t('domain_tab_DNS_modification_button_apply')}
      primaryLabel={t('domain_tab_DNS_modification_button_apply')}
      secondaryLabel={tCommon(`${NAMESPACES.ACTIONS}:cancel`)}
      isOpen={isModalOpen}
      onPrimaryButtonClick={handleApply}
      onSecondaryButtonClick={onClose}
      onDismiss={onClose}
      isLoading={isUpdateDomainPending}
      isPrimaryButtonDisabled={isFetchingDomainResource}
    >
      <div className="flex flex-col gap-2">
        <Text>{t('domain_tab_DNS_modification_modal_body')}</Text>
        <ul className="list-disc pl-12 space-y-1">
          {nameServers.map((ns, index) => (
            <li key={`${ns.nameServer}-${index}`}>
              <Text>{ns.nameServer}</Text>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
