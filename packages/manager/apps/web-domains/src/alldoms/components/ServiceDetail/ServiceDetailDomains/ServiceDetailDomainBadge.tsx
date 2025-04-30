import { OdsBadge } from '@ovhcloud/ods-components/react';
import React from 'react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { DomainStateEnum } from '@/alldoms/enum/service.enum';

interface ServiceDetailDomainBadgeProps {
  readonly label: DomainStateEnum;
  readonly color: ODS_BADGE_COLOR;
}

export default function ServiceDetailDomainBadge({
  label,
  color,
}: ServiceDetailDomainBadgeProps) {
  let resolvedColor = color;

  switch (label) {
    case DomainStateEnum.ok:
    case DomainStateEnum.autorenew_in_progress:
    case DomainStateEnum.autorenew_registry_in_progress:
      resolvedColor = ODS_BADGE_COLOR.success;
      break;

    case DomainStateEnum.pending_create:
    case DomainStateEnum.pending_delete:
    case DomainStateEnum.pending_incoming_transfer:
    case DomainStateEnum.pending_installation:
    case DomainStateEnum.outgoing_transfer:
    case DomainStateEnum.restorable:
      resolvedColor = ODS_BADGE_COLOR.warning;
      break;

    case DomainStateEnum.expired:
    case DomainStateEnum.deleted:
    case DomainStateEnum.dispute:
    case DomainStateEnum.technical_suspended:
    case DomainStateEnum.registry_suspended:
      resolvedColor = ODS_BADGE_COLOR.neutral;
      break;

    default:
      resolvedColor = ODS_BADGE_COLOR.neutral;
      break;
  }

  return <OdsBadge label={label} color={resolvedColor} />;
}
