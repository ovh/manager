import { Badge, Icon } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import {
  DnssecStateEnum,
  DomainServiceStateEnum,
  StatusDetails,
  TransferLockStatusEnum,
} from '@/domain/types/domainResource';
import { domainStatusToBadge } from '@/domain/utils/domainStatus';
import { SuspensionStateEnum } from '@/domain/enum/suspensionState.enum';

interface DatagridColumnStatusProps {
  readonly state:
    | DomainServiceStateEnum
    | SuspensionStateEnum
    | TransferLockStatusEnum
    | DnssecStateEnum;
  readonly mapping: Record<string, StatusDetails>;
}

export default function DatagridColumnStatus({
  state,
  mapping,
}: DatagridColumnStatusProps) {
  const { t } = useTranslation('domain');
  const domainState = domainStatusToBadge(mapping, state);
  return (
    <>
      {domainState && (
        <Badge
          color={domainState.statusColor}
          data-testid={`status-badge-${state}`}
          className="w-max"
        >
          {domainState?.icon && <Icon name={domainState.icon} />}
          {t(domainState?.i18nKey)}
        </Badge>
      )}
    </>
  );
}
