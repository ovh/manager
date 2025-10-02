import React from 'react';
import { useTranslation } from 'react-i18next';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import {
  Badge,
  BADGE_COLOR,
  Icon,
  ICON_NAME,
  Toggle,
  ToggleControl,
  ToggleLabel,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import {
  useGetDnssecStatus,
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

interface ConfigurationCardsProps {
  readonly serviceName: string;
}

export default function ConfigurationCards({
  serviceName,
}: ConfigurationCardsProps) {
  const { t } = useTranslation(['domain']);
  const { domainResource } = useGetDomainResource(serviceName);
  const { authInfo, isAuthInfoLoading } = useGetDomainAuthInfo(serviceName);
  console.log(authInfo)
  const [dnssecModalOpened, setDnssecModalOpened] = React.useState<boolean>(
    false,
  );
  const [transferModalOpened, setTransferModalOpened] = React.useState<boolean>(
    false,
  );
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
    </ManagerTile>
  );
}
