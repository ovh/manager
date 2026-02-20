import { Badge, BADGE_SIZE } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';

const COMING_SOON_CLASSNAME =
  'bg-[--ods-color-neutral-500] !text-[--ods-color-element-text-selected] text-xs';

export const ComingSoonBadge = () => {
  const { t } = useTranslation(['common']);
  return (
    <Badge className={COMING_SOON_CLASSNAME} size={BADGE_SIZE.sm}>
      {t('common:pci_instances_common_coming_soon')}
    </Badge>
  );
};
