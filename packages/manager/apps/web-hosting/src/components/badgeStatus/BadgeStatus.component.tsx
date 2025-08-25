import React, { useMemo } from 'react';
import { Badge } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { DATAGRID_LINK, WEBSITE } from '@/utils/tracking.constants';

import { getStatusColor } from '@/utils/getStatusColor';

export type BadgeStatusProps = {
  itemStatus: string;
  'data-testid'?: string;
  tracking?: string;
  href?: string;
  isLoading?: boolean;
  label?: string;
};

export const BadgeStatus: React.FC<BadgeStatusProps> = ({
  itemStatus,
  href,
  tracking,
  label,
  isLoading,
}) => {
  const { t } = useTranslation('common');
  const { trackClick } = useOvhTracking();
  const statusColor = useMemo(() => getStatusColor(itemStatus), [itemStatus]);
  return (
    <Badge
      onClick={() => {
        if (tracking) {
          trackClick({
            location: PageLocation.datagrid,
            buttonType: ButtonType.link,
            actionType: 'navigation',
            actions: [`${DATAGRID_LINK}${tracking}_${WEBSITE}`],
          });
        }
        window.open(href, '_blank');
      }}
      data-testid={`badge-status-${itemStatus}`}
      color={statusColor}
      label={label || t(`web_hosting_status_${itemStatus.toLowerCase()}`)}
      className="mr-4 cursor-pointer inline-block"
      isLoading={isLoading}
    />
  );
};
