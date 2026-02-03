import { Badge, BADGE_COLOR } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { ContactMeanStatus } from '@/data/types/contact-mean.type';

const STATUS_COLOR: Record<ContactMeanStatus, BADGE_COLOR> = {
  ERROR: BADGE_COLOR.critical,
  DISABLED: BADGE_COLOR.critical,
  VALID: BADGE_COLOR.success,
  TO_VALIDATE: BADGE_COLOR.information,
};

export default function ContactMeanStatusChip({
  status,
}: {
  status: ContactMeanStatus;
}) {
  const { t } = useTranslation('common');
  return (
    <Badge
      color={STATUS_COLOR[status]}
    >
      {t(`status_${status.toLowerCase()}`)}
    </Badge>
  );
}
