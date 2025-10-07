import React from 'react';
import { useTranslation } from 'react-i18next';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import {
  useGetDnssecStatus,
  useGetDomainAnycastOption,
  useGetDomainAuthInfo,
  useGetDomainResource,
  useUpdateDnssecService,
} from '@/domain/hooks/data/query';
import { DnssecStatusEnum } from '@/domain/enum/dnssecStatus.enum';
import DnssecModal from './DnssecModal';
import DnssecToggleStatus from './DnssecToggleStatus';
import TransferToggleStatus from './TransferToggleStatus';
import TransferModal from './TransferModal';
import { ProtectionStateEnum } from '@/domain/enum/protectionState.enum';
import TransferAuthInfoModal from './TransferAuthInfoModal';
import DnsState from './DnsState';
import AnycastTerminateModal from '@/domain/components/AnycastOrder/AnycastTerminateModal';

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

  const updateDnssec = () => {
    updateServiceDnssec();
    setDnssecModalOpened(!dnssecModalOpened);
  };

  if (!domainResource && !dnssecStatus) {
    return <></>;
  }

  return (
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
        transferAuthInfoModalOpened={transferAuthInfoModalOpened}
        setTransferAuthInfoModalOpened={setTransferAuthInfoModalOpened}
      />
      <DnssecModal
        action={dnssecStatus?.status}
        open={dnssecModalOpened}
        updateDnssec={updateDnssec}
        onClose={() => setDnssecModalOpened(!dnssecModalOpened)}
      />
      <TransferModal
        serviceName={serviceName}
        action={ProtectionStateEnum.UNPROTECTED}
        open={transferModalOpened}
        updateDomain={() => null}
        onClose={() => setTransferModalOpened(!transferModalOpened)}
      />
      <TransferAuthInfoModal
        authInfo={authInfo}
        isAuthInfoLoading={isAuthInfoLoading}
        onClose={() =>
          setTransferAuthInfoModalOpened(!transferAuthInfoModalOpened)
        }
        open={transferAuthInfoModalOpened}
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
  );
}
