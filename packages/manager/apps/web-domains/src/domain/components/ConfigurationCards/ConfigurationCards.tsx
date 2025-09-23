import React from 'react';
import { useTranslation } from 'react-i18next';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import { Badge, BADGE_COLOR } from '@ovhcloud/ods-react';
import {
  useGetDnssecStatus,
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

interface ConfigurationCardsProps {
  readonly serviceName: string;
}

export default function ConfigurationCards({
  serviceName,
}: ConfigurationCardsProps) {
  const { t } = useTranslation(['domain']);
  const { domainResource } = useGetDomainResource(serviceName);
  const { authInfo, isAuthInfoLoading } = useGetDomainAuthInfo(serviceName);
  const [dnssecModalOpened, setDnssecModalOpened] = React.useState<boolean>(
    false,
  );
  const [transferModalOpened, setTransferModalOpened] = React.useState<boolean>(
    false,
  );
  const [tagModalOpened, setTagModalOpened] = React.useState<boolean>(false);
  const [tag, setTag] = React.useState<string>('');
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

  const { updateDomain } = useUpdateDomainResource(serviceName);
  const {
    transferTag,
    isTransferTagPending,
    transferTagError,
  } = useTransferTag(serviceName, tag);

  const handleTag = () => {
    setTag(tag);
    transferTag();
  };

  const handleUpdateProtectionState = () => {
    const checksum = domainResource?.checksum;
    if (!checksum) return;
    const cleanedNameServers = domainResource?.currentState?.dnsConfiguration?.nameServers.map(
      ({ nameServer, ipv4, ipv6 }) => ({
        nameServer,
        ...(ipv4 ? { ipv4 } : {}),
        ...(ipv6 ? { ipv6 } : {}),
      }),
    );
    const newProtectionState =
      domainResource?.currentState?.protectionState ===
      ProtectionStateEnum.UNPROTECTED
        ? ProtectionStateEnum.PROTECTED
        : ProtectionStateEnum.UNPROTECTED;
    updateDomain(
      {
        checksum,
        nameServers: cleanedNameServers,
        protectionState: newProtectionState,
        hosts: domainResource?.targetSpec?.hostsConfiguration?.hosts,
      },
      {
        onSuccess: () => {
          setTransferModalOpened(false);
        },
        onError: (error: TUpdateDNSConfigError) => {
          setTransferModalOpened(false);
          console.log(error);
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
    <ManagerTile>
      <ManagerTile.Title>
        {t('domain_tab_general_information_configuration')}
      </ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>Serveur DNS</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <Badge color={BADGE_COLOR.success} className="mt-4">
            Enregistré
          </Badge>
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
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
    </ManagerTile>
  );
}
