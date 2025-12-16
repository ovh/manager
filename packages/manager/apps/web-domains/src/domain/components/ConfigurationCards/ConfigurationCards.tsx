import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import {
  useGetDnssecStatus,
  useGetDomainAnycastOption,
  useGetDomainAuthInfo,
  useGetDomainResource,
  useTransferTag,
  useUpdateDnssecService,
  useUpdateDomainResource,
} from '@/domain/hooks/data/query';
import { DnssecStatusEnum } from '@/domain/enum/dnssecStatus.enum';
import DnssecModal from './DnssecModal';
import DnssecToggleStatus from './DnssecToggleStatus';
import TransferToggleStatus from './TransferToggleStatus';
import TransferModal from './TransferModal';
import TransferAuthInfoModal from './TransferAuthInfoModal';
import { TUpdateDNSConfigError } from '@/domain/types/error';
import { ProtectionStateEnum } from '@/domain/enum/protectionState.enum';
import TransferTagModal from './TagModal';
import DataProtection from './DataProtection';
import DataProtectionDrawer from './DataProtectionDrawer';
import {
  DisclosureConfigurationEnum,
  TContactsConfigurationTargetSpec,
} from '@/domain/types/domainResource';
import DnsState from './DnsState';
import AnycastTerminateModal from '../AnycastOrder/AnycastTerminateModal';

interface ConfigurationCardsProps {
  readonly serviceName: string;
}

export default function ConfigurationCards({
  serviceName,
}: ConfigurationCardsProps) {
  const { t } = useTranslation(['domain']);
  const { domainResource } = useGetDomainResource(serviceName);
  const { authInfo, isAuthInfoLoading } = useGetDomainAuthInfo(serviceName);
  const { anycastOption, isFetchingAnycastOption } = useGetDomainAnycastOption(
    serviceName,
  );
  const [dnssecModalOpened, setDnssecModalOpened] = React.useState<boolean>(
    false,
  );
  const [transferModalOpened, setTransferModalOpened] = React.useState<boolean>(
    false,
  );
  const [tagModalOpened, setTagModalOpened] = React.useState<boolean>(false);
  const [
    dataProtectionDrawerOpened,
    setDataProtectionDrawerOpened,
  ] = React.useState<boolean>(false);
  const [tag, setTag] = React.useState<string>('');
  const [
    anycastTerminateModalOpen,
    setAnycastTerminateModalOpen,
  ] = React.useState<boolean>(false);
  const [restoreAnycast, setRestoreAnycast] = React.useState<boolean>(false);
  const [
    transferAuthInfoModalOpened,
    setTransferAuthInfoModalOpened,
  ] = React.useState<boolean>(false);
  const { dnssecStatus, isDnssecStatusLoading } = useGetDnssecStatus(
    serviceName,
  );

  const { updateServiceDnssec } = useUpdateDnssecService(
    serviceName,
    dnssecStatus?.status === DnssecStatusEnum.ENABLED
      ? DnssecStatusEnum.DISABLED
      : DnssecStatusEnum.ENABLED,
  );

  const {
    updateDomain,
    errorMessage,
    isUpdateDomainPending,
  } = useUpdateDomainResource(serviceName);
  const {
    transferTag,
    isTransferTagPending,
    transferTagError,
  } = useTransferTag(serviceName, tag);

  const visibleContacts = useMemo(() => {
    const contacts = domainResource?.currentState?.contactsConfiguration;
    if (!contacts) return [];

    return Object.entries(contacts)
      .filter(([_, contact]) => contact.disclosurePolicy?.visibleViaRdds)
      .map(([key, contact]) => ({
        key,
        id: contact.id,
        label: key.replace('contact', ''),
        disclosedFields: contact.disclosurePolicy?.disclosedFields || [],
      }));
  }, [domainResource]);

  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  React.useEffect(() => {
    const contacts = domainResource?.currentState?.contactsConfiguration;
    if (!contacts) return;

    const disclosedContacts = Object.entries(contacts)
      .filter(
        ([_, contact]) =>
          contact.disclosurePolicy?.visibleViaRdds &&
          contact.disclosurePolicy?.disclosureConfiguration ===
            DisclosureConfigurationEnum.DISCLOSED,
      )
      .map(([key]) => key);
    setSelectedContacts(disclosedContacts);
  }, [domainResource]);

  const handleCheckboxChange = (
    contactKey: string,
    checked: boolean | 'indeterminate',
  ) => {
    if (checked === 'indeterminate') return;

    setSelectedContacts((prev) =>
      checked
        ? [...prev, contactKey]
        : prev.filter((key) => key !== contactKey),
    );
  };

  const handleTag = () => {
    setTag(tag);
    transferTag();
  };

  const handleUpdateProtectionState = () => {
    if (!domainResource?.checksum || !domainResource?.targetSpec) return;

    const newProtectionState =
      domainResource?.currentState?.protectionState ===
      ProtectionStateEnum.UNPROTECTED
        ? ProtectionStateEnum.PROTECTED
        : ProtectionStateEnum.UNPROTECTED;

    updateDomain(
      {
        checksum: domainResource.checksum,
        currentTargetSpec: domainResource.targetSpec,
        updatedSpec: {
          protectionState: newProtectionState,
        },
      },
      {
        onSuccess: () => {
          setTransferModalOpened(false);
        },
        onError: (error: TUpdateDNSConfigError) => {
          setTransferModalOpened(false);
        },
      },
    );
  };

  const handleUpdateDataProtection = () => {
    if (!domainResource?.checksum || !domainResource?.targetSpec) return;

    const contacts = domainResource?.currentState?.contactsConfiguration;
    if (!contacts) return;

    const contactsConfiguration = Object.entries(contacts).reduce(
      (acc, [key, contact]) => {
        if (contact.disclosurePolicy?.visibleViaRdds) {
          acc[key] = {
            ...(key === 'contactOwner' && { id: contact.id }),
            disclosurePolicy: {
              disclosureConfiguration: selectedContacts.includes(key)
                ? DisclosureConfigurationEnum.DISCLOSED
                : DisclosureConfigurationEnum.REDACTED,
            },
          };
        }
        return acc;
      },
      {} as TContactsConfigurationTargetSpec,
    );

    updateDomain(
      {
        checksum: domainResource.checksum,
        currentTargetSpec: { ...domainResource.targetSpec },
        updatedSpec: {
          contactsConfiguration,
        },
      },
      {
        onSuccess: () => {
          setDataProtectionDrawerOpened(false);
        },
      },
    );
  };

  const updateDnssec = () => {
    updateServiceDnssec();
    setDnssecModalOpened(!dnssecModalOpened);
  };

  if (!domainResource && !dnssecStatus) {
    return <></>;
  }

  return (
    <>
      {dataProtectionDrawerOpened && (
        <div
          className="fixed inset-0 bg-[--ods-color-primary-500] opacity-75 z-40"
          onClick={() => setDataProtectionDrawerOpened(false)}
        />
      )}
      <ManagerTile>
        <ManagerTile.Title>
          {t('domain_tab_general_information_configuration')}
        </ManagerTile.Title>
        <ManagerTile.Divider />
        <DnsState
          domainResource={domainResource}
          serviceName={serviceName}
          anycastOption={anycastOption}
          isFetchingAnycastOption={isFetchingAnycastOption}
          anycastTerminateModalOpen={anycastTerminateModalOpen}
          setAnycastTerminateModalOpen={setAnycastTerminateModalOpen}
          restoreAnycast={restoreAnycast}
          setRestoreAnycast={setRestoreAnycast}
        />
        <ManagerTile.Divider />
        <DnssecToggleStatus
          dnssecModalOpened={dnssecModalOpened}
          dnssecStatus={dnssecStatus}
          domainResource={domainResource}
          isDnssecStatusLoading={isDnssecStatusLoading}
          setDnssecModalOpened={setDnssecModalOpened}
        />
        <ManagerTile.Divider />
        <TransferToggleStatus
          domainResource={domainResource}
          transferModalOpened={transferModalOpened}
          setTransferModalOpened={setTransferModalOpened}
          setTransferAuthInfoModalOpened={setTransferAuthInfoModalOpened}
          setTagModalOpened={setTagModalOpened}
        />
        <DnssecModal
          action={dnssecStatus?.status}
          open={dnssecModalOpened}
          updateDnssec={updateDnssec}
          onClose={() => setDnssecModalOpened(!dnssecModalOpened)}
        />
        <ManagerTile.Divider />
        <DataProtection
          domainResource={domainResource}
          setDataProtectionDrawerOpened={setDataProtectionDrawerOpened}
        />
        <TransferModal
          serviceName={serviceName}
          action={domainResource?.currentState.protectionState}
          open={transferModalOpened}
          updateDomain={() => handleUpdateProtectionState()}
          onClose={() => setTransferModalOpened(!transferModalOpened)}
        />
        <TransferAuthInfoModal
          authInfo={authInfo}
          authInfoManagedByOVH={
            domainResource?.currentState?.authInfoManagedByOVHcloud
          }
          isAuthInfoLoading={isAuthInfoLoading}
          onClose={() =>
            setTransferAuthInfoModalOpened(!transferAuthInfoModalOpened)
          }
          open={transferAuthInfoModalOpened}
        />
        <TransferTagModal
          tag={tag}
          setTag={setTag}
          handleTag={handleTag}
          serviceName={serviceName}
          isTransferTagPending={isTransferTagPending}
          transferTagError={transferTagError}
          open={tagModalOpened}
          onClose={() => setTagModalOpened(!tagModalOpened)}
        />
        <DataProtectionDrawer
          isDrawerOpen={dataProtectionDrawerOpened}
          onClose={() => setDataProtectionDrawerOpened(false)}
          domainResource={domainResource}
          visibleContacts={visibleContacts}
          selectedContacts={selectedContacts}
          onCheckboxChange={handleCheckboxChange}
          onClick={() => {
            handleUpdateDataProtection();
          }}
          errorMessage={errorMessage}
          isUpdateDomainPending={isUpdateDomainPending}
        />
        <AnycastTerminateModal
          serviceName={serviceName}
          restore={restoreAnycast}
          anycastTerminateModalOpen={anycastTerminateModalOpen}
          expirationDate={anycastOption?.expirationDate}
          onOpenAnycastTerminateModal={() =>
            setAnycastTerminateModalOpen(!anycastTerminateModalOpen)
          }
        />
      </ManagerTile>
    </>
  );
}
