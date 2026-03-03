import { TStatusBadgeProps } from '@/components/status-badge/StatusBadge.component';
import { TAclStatus } from '@/domain/entities/acl.entity';

export { ACL_STATUSES } from '@/domain/entities/acl.entity';

const STATUS_TO_DISPLAY: Record<TAclStatus, TStatusBadgeProps> = {
  draft: { labelKey: 'status:draft', badgeColor: 'neutral' },
  activating: { labelKey: 'status:creating', badgeColor: 'warning' },
  active: { labelKey: 'status:active', badgeColor: 'success' },
  deleting: { labelKey: 'status:deleting', badgeColor: 'warning' },
  error: { labelKey: 'status:error', badgeColor: 'critical' },
};

export const getAclStatusDisplay = (status: TAclStatus): TStatusBadgeProps =>
  STATUS_TO_DISPLAY[status] ?? { labelKey: status, badgeColor: 'neutral' };
