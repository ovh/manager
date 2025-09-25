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
  useGetDomainResource,
  useUpdateDnssecService,
} from '@/domain/hooks/data/query';
import { DnssecStatusEnum } from '@/domain/enum/dnssecStatus.enum';
import DnssecModal from './DnssecModal';
import DnssecToggleStatus from './DnssecToggleStatus';

interface ConfigurationCardsProps {
  readonly serviceName: string;
}

export default function ConfigurationCards({
  serviceName,
}: ConfigurationCardsProps) {
  const { t } = useTranslation(['domain']);
  const { domainResource } = useGetDomainResource(serviceName);
  const [dnssecModalOpened, setDnssecModalOpened] = React.useState<boolean>(
    false,
  );
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
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          Protection contre le transfert
          <Tooltip>
            <TooltipTrigger asChild>
              <Icon className="pl-3" name={ICON_NAME.circleQuestion} />
            </TooltipTrigger>
            <TooltipContent>
              {t('domain_tab_general_information_tooltip_domain_state')}
            </TooltipContent>
          </Tooltip>
        </ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <Toggle withLabels={true} className="items-end">
            <ToggleControl />
            <ToggleLabel>
              <Badge color={BADGE_COLOR.success} className="mt-4">
                Enregistré
              </Badge>
            </ToggleLabel>
          </Toggle>
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <DnssecModal
        action={dnssecStatus?.status}
        open={dnssecModalOpened}
        updateDnssec={updateDnssec}
        onClose={() => setDnssecModalOpened(!setDnssecModalOpened)}
      />
    </ManagerTile>
  );
}
