import { OdsBadge } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { TOdsBadgeColor } from './types';

export type TStatusBadgeProps = {
  status: string;
  translationKey: string;
  color: TOdsBadgeColor;
  className?: string;
  isStorageCard?: boolean;
};

export const StatusBadge = ({
  status,
  translationKey,
  color,
  className = '',
  isStorageCard = false,
}: TStatusBadgeProps) => {
  const { t } = useTranslation(['containers/enable-versioning']);
  return (
    <div>
      <OdsBadge
        size="md"
        label={
          isStorageCard
            ? t(`${translationKey}_${status}`)
            : t(`${translationKey}_${status}_label`)
        }
        color={color}
        className={className}
      />
    </div>
  );
};
