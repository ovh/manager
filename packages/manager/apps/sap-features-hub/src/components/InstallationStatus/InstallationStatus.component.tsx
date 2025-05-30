import React from 'react';
import {
  ODS_BADGE_COLOR,
  ODS_BADGE_SIZE,
  OdsBadge as OdsBadgeType,
} from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { SAPInstallationStatus } from '@/types/installation.type';
import { BADGE_COLOR_STATUS } from './InstallationStatus.constants';

export type InstallationStatusProps = Omit<
  OdsBadgeType,
  'render' | 'color' | 'label' | 'size'
> & {
  status: SAPInstallationStatus;
  size?: ODS_BADGE_SIZE;
};

export const InstallationStatus = ({
  status,
  size = ODS_BADGE_SIZE.md,
  ...rest
}: InstallationStatusProps) => {
  const { t } = useTranslation('installation');
  return (
    <React.Suspense>
      <OdsBadge
        label={t(`status_${status}`)}
        size={size}
        color={BADGE_COLOR_STATUS[status] ?? ODS_BADGE_COLOR.neutral}
        {...rest}
      />
    </React.Suspense>
  );
};
