import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ContactMeanStatus } from '@/data/types/contact-mean.type';

const STATUS_COLOR: Record<ContactMeanStatus, ODS_BADGE_COLOR> = {
  ERROR: ODS_BADGE_COLOR.critical,
  DISABLED: ODS_BADGE_COLOR.critical,
  VALID: ODS_BADGE_COLOR.success,
  TO_VALIDATE: ODS_BADGE_COLOR.information,
};

export default function ContactMeanStatusChip({
  status,
}: {
  status: ContactMeanStatus;
}) {
  const { t } = useTranslation('common');
  return (
    <OdsBadge
      color={STATUS_COLOR[status]}
      label={t(`status_${status.toLowerCase()}`)}
    />
  );
}
