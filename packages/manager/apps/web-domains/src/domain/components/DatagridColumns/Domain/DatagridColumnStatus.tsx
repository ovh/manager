import { Icon } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import {
  DnssecStateEnum,
  DomainServiceStateEnum,
  StatusDetails,
  TransferLockStatusEnum,
} from '@/domain/types/domainResource';
import { domainStatusToBadge } from '@/domain/utils/domainStatus';
import { SuspensionStateEnum } from '@/domain/enum/suspensionState.enum';
import {
  AdditionalDomainStateEnum,
  DomainStateEnum,
} from '@/domain/enum/domainState.enum';
import { ProtectionStateEnum } from '@/domain/enum/protectionState.enum';
import { CellRow, ColumnMetaType } from '@ovh-ux/muk';

interface DatagridColumnStatusProps {
  readonly state:
    | AdditionalDomainStateEnum
    | DomainServiceStateEnum
    | SuspensionStateEnum
    | TransferLockStatusEnum
    | DnssecStateEnum
    | DomainStateEnum
    | ProtectionStateEnum;
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
        <CellRow
          type={'badge' as ColumnMetaType}
          badgeColor={domainState?.statusColor}
          data-testid={`status-badge-${state}`}
        >
          {domainState?.icon && <Icon name={domainState.icon} />}
          {t(domainState?.i18nKey)}
        </CellRow>
      )}
    </>
  );
}
